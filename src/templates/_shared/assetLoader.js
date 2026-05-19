// Asset loading manager with progress tracking
export class AssetLoader {
  constructor() {
    this.assets = new Map();
    this.loading = new Map();
    this.progress = 0;
    this.onProgress = null;
  }

  async loadImage(url, cacheKey = url) {
    if (this.assets.has(cacheKey)) {
      return this.assets.get(cacheKey);
    }

    if (this.loading.has(cacheKey)) {
      return this.loading.get(cacheKey);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.assets.set(cacheKey, img);
        this.loading.delete(cacheKey);
        this.updateProgress();
        resolve(img);
      };
      img.onerror = () => {
        this.loading.delete(cacheKey);
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });

    this.loading.set(cacheKey, promise);
    return promise;
  }

  async loadJSON(url) {
    if (this.assets.has(url)) {
      return this.assets.get(url);
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load JSON: ${url}`);
    const data = await response.json();
    this.assets.set(url, data);
    return data;
  }

  preloadAssets(assetList) {
    return Promise.all(
      assetList.map(({ url, type, key }) => {
        if (type === 'image') {
          return this.loadImage(url, key);
        } else if (type === 'json') {
          return this.loadJSON(url);
        }
        return Promise.resolve();
      })
    );
  }

  updateProgress() {
    const total = this.loading.size + this.assets.size;
    const loaded = this.assets.size;
    this.progress = total > 0 ? (loaded / total) * 100 : 100;
    if (this.onProgress) {
      this.onProgress(this.progress);
    }
  }

  getAsset(key) {
    return this.assets.get(key);
  }

  clear() {
    this.assets.clear();
    this.loading.clear();
    this.progress = 0;
  }
}

export const assetLoaderInstance = new AssetLoader();
