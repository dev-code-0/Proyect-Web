import { createClient } from 'jsr:@supabase/supabase-js@2';

const ALLOWED_ORIGINS = [
  'https://sorpresavirtual.com',
  'https://www.sorpresavirtual.com',
  'http://localhost:5173',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;   // 8 MB
const MAX_AUDIO_BYTES = 15 * 1024 * 1024;  // 15 MB
const RATE_LIMIT = 60;                      // uploads por hora por IP

const IMAGE_SIGNATURES = [
  { bytes: [0xFF, 0xD8, 0xFF], offset: 0 },           // JPEG
  { bytes: [0x89, 0x50, 0x4E, 0x47], offset: 0 },     // PNG
  { bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 },     // GIF
  { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },     // WebP (RIFF)
  { bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },     // AVIF / HEIC
];

const AUDIO_SIGNATURES = [
  { bytes: [0x49, 0x44, 0x33], offset: 0 },            // MP3 ID3
  { bytes: [0xFF, 0xFB], offset: 0 },                   // MP3 frame
  { bytes: [0xFF, 0xF3], offset: 0 },                   // MP3 frame
  { bytes: [0xFF, 0xF2], offset: 0 },                   // MP3 frame
  { bytes: [0x4F, 0x67, 0x67, 0x53], offset: 0 },      // OGG
  { bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },      // M4A / AAC
  { bytes: [0x66, 0x4C, 0x61, 0x43], offset: 0 },      // FLAC
  { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },      // WAV (RIFF)
];

function matchesSig(
  bytes: Uint8Array,
  sig: { bytes: number[]; offset: number },
): boolean {
  return sig.bytes.every((b, i) => bytes[sig.offset + i] === b);
}

function isValidMagic(bytes: Uint8Array, kind: 'image' | 'audio'): boolean {
  const sigs = kind === 'image' ? IMAGE_SIGNATURES : AUDIO_SIGNATURES;
  return sigs.some((s) => matchesSig(bytes, s));
}

function randomId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') return new Response('OK', { headers: corsHeaders });

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Rate limit: máximo 30 uploads por hora por IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from('rate_limit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .eq('endpoint', '/upload-file')
      .gte('created_at', oneHourAgo);

    if (countError) {
      console.error('Rate limit check failed:', countError);
    } else if ((count || 0) >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'Límite de subidas alcanzado. Intenta en una hora.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const kind = (formData.get('fileType') as string || 'image').toLowerCase() as 'image' | 'audio';
    const templateId = (formData.get('templateId') as string || 'misc').replace(/[^a-z0-9-]/gi, '');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se recibió ningún archivo' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validación de tamaño
    const maxBytes = kind === 'audio' ? MAX_AUDIO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      return new Response(
        JSON.stringify({ error: `Archivo demasiado grande. Máximo: ${maxBytes / 1024 / 1024}MB` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Validación de magic bytes
    const headerBuf = await file.slice(0, 16).arrayBuffer();
    const headerBytes = new Uint8Array(headerBuf);
    if (!isValidMagic(headerBytes, kind)) {
      return new Response(
        JSON.stringify({ error: 'Tipo de archivo no permitido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Extensión: imágenes siempre webp (comprimidas por el cliente), audio conserva original
    const ext = kind === 'audio'
      ? (file.name.split('.').pop()?.toLowerCase() || 'mp3')
      : 'webp';
    const filePath = `${templateId}/${randomId()}.${ext}`;

    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('archivos_usuarios')
      .upload(filePath, fileBuffer, {
        contentType: file.type || (kind === 'audio' ? 'audio/mpeg' : 'image/webp'),
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Error al subir el archivo' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Registrar uso del rate limit solo tras upload exitoso
    await supabase
      .from('rate_limit_logs')
      .insert([{ ip_address: ip, endpoint: '/upload-file' }]);

    const { data: publicData } = supabase.storage
      .from('archivos_usuarios')
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ success: true, url: publicData.publicUrl }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
