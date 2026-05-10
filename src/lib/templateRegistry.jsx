import React from 'react';

// Configs — static imports (tiny JS objects, no heavy dependencies)
import { diaMujerConfig } from '../templates/dia-mujer/config.js';
import { pruebaConexConfig } from '../templates/prueba-conex/config.js';
import { floresAmarillasConfig } from '../templates/flores-amarillas/config.js';
import { preguntaConfig } from '../templates/pregunta/config.js';
import { floresCorazonesConfig } from '../templates/flores-corazones/config.js';
import { girasolesConfig } from '../templates/girasoles/config.js';
import { hotWheelsConfig } from '../templates/hot-wheels/config.js';
import { CorazonCarruselConfig } from '../templates/corazon-carrusel/config.js';
import { corazonAnimadoConfig } from '../templates/corazon-animado/config.js';
import { libroPopConfig } from '../templates/libro-pop/config.js';
import { cajaMusicalConfig } from '../templates/caja-musical/config.js';
import { fuegosAmorConfig } from '../templates/corazon-mensaje/config.js';
import { floresParaTiConfig } from '../templates/flores-para-ti/config.js';
import { sanValentinConfig } from '../templates/app-recuerdos/config.js';
import { sorpresaRomanticaConfig } from '../templates/sorpresa-romantica/config.js';
import { galaxiaMomentosConfig } from '../templates/galaxia-momentos/config.js';
import { vueloGlobalConfig } from '../templates/vuelo-global/config.js';
import { arbolMadreConfig } from '../templates/arbol-madre/config.js';
import { jardinMadreConfig } from '../templates/jardin-madre/config.js';

// Components — lazy loaded so each template is its own JS chunk
const DiaMujerTemplate      = React.lazy(() => import('../templates/dia-mujer/index.jsx'));
const RosaVirtualTemplate   = React.lazy(() => import('../templates/rosa-virtual/index.jsx'));
const PruebaConexTemplate   = React.lazy(() => import('../templates/prueba-conex/index.jsx'));
const FloresAmarillas       = React.lazy(() => import('../templates/flores-amarillas/index.jsx'));
const NoviaPregunta         = React.lazy(() => import('../templates/pregunta/index.jsx'));
const FloresCorazones       = React.lazy(() => import('../templates/flores-corazones/index.jsx'));
const GirasolesTemplate     = React.lazy(() => import('../templates/girasoles/index.jsx'));
const RamoHotWheels         = React.lazy(() => import('../templates/hot-wheels/index.jsx'));
const CorazonCarrusel       = React.lazy(() => import('../templates/corazon-carrusel/index.jsx'));
const CorazonAnimado        = React.lazy(() => import('../templates/corazon-animado/index.jsx'));
const LibroPopUp            = React.lazy(() => import('../templates/libro-pop/index.jsx'));
const CajaMusical           = React.lazy(() => import('../templates/caja-musical/index.jsx'));
const FuegosAmor            = React.lazy(() => import('../templates/corazon-mensaje/index.jsx'));
const FloresParaTi          = React.lazy(() => import('../templates/flores-para-ti/index.jsx'));
const SanValentinApp        = React.lazy(() => import('../templates/app-recuerdos/index.jsx'));
const SorpresaRomantica     = React.lazy(() => import('../templates/sorpresa-romantica/index.jsx'));
const GalaxyMomentos        = React.lazy(() => import('../templates/galaxia-momentos/index.jsx'));
const VueloGlobal           = React.lazy(() => import('../templates/vuelo-global/VueloGlobal.jsx'));
const ArbolMadre            = React.lazy(() => import('../templates/arbol-madre/index.jsx'));
const JardinMadre           = React.lazy(() => import('../templates/jardin-madre/index.jsx'));

// Registry: template ID → { Component, config }
// rosa-virtual uses RosaCreator in Preview (config: null); Component se usa en ViewGift
// prueba-conex alias mantiene compatibilidad con registros legacy en BD
export const TEMPLATE_REGISTRY = {
  'dia-mujer':          { Component: DiaMujerTemplate,    config: diaMujerConfig },
  'rosa-virtual':       { Component: RosaVirtualTemplate, config: null },
  'viernes-13':         { Component: PruebaConexTemplate, config: pruebaConexConfig },
  'prueba-conex':       { Component: PruebaConexTemplate, config: pruebaConexConfig },
  'flores-amarillas':   { Component: FloresAmarillas,     config: floresAmarillasConfig },
  'pregunta':           { Component: NoviaPregunta,        config: preguntaConfig },
  'flores-corazones':   { Component: FloresCorazones,      config: floresCorazonesConfig },
  'girasoles':          { Component: GirasolesTemplate,   config: girasolesConfig },
  'hot-wheels':         { Component: RamoHotWheels,        config: hotWheelsConfig },
  'corazon-carrusel':   { Component: CorazonCarrusel,      config: CorazonCarruselConfig },
  'corazon-animado':    { Component: CorazonAnimado,       config: corazonAnimadoConfig },
  'libro-pop':          { Component: LibroPopUp,           config: libroPopConfig },
  'caja-musical':       { Component: CajaMusical,          config: cajaMusicalConfig },
  'corazon-mensaje':    { Component: FuegosAmor,           config: fuegosAmorConfig },
  'flores-para-ti':     { Component: FloresParaTi,         config: floresParaTiConfig },
  'app-recuerdos':      { Component: SanValentinApp,       config: sanValentinConfig },
  'sorpresa-romantica': { Component: SorpresaRomantica,    config: sorpresaRomanticaConfig },
  'galaxia-momentos':   { Component: GalaxyMomentos,       config: galaxiaMomentosConfig },
  'vuelo-global':       { Component: VueloGlobal,          config: vueloGlobalConfig },
  'arbol-madre':        { Component: ArbolMadre,           config: arbolMadreConfig },
  'jardin-madre':       { Component: JardinMadre,          config: jardinMadreConfig },
};
