// --- Source: src/js/controllers/media.js ---
export const BAF_MediaController = {
  /**
   * Merekayasa URL Google CDN secara dinamis ke WebP dengan dimensi kustom.
   * @param {string} url - URL gambar asli dari Google CDN / Blogger Feed
   * @param {number} width - Target lebar fisik dalam piksel
   * @param {number} height - Target tinggi fisik dalam piksel
   * @param {boolean} crop - Aktifkan pemotongan tengah kustom (Default: true)
   * @returns {string} URL gambar teroptimasi
   */
  getOptimizedCDNUrl(url, width, height, crop = true) {
    if (!url) return '';

    // Periksa apakah URL berasal dari infrastruktur CDN Google tepercaya
    const googleCDNPorter = /lh\.googleusercontent\.com|blogger\.googleusercontent\.com|bp\.blogspot\.com/i;
    if (!googleCDNPorter.test(url)) {
      return url; // Kembalikan URL asli jika merupakan hosting eksternal
    }

    // Hilangkan parameter ukuran bawaan Blogger yang sudah ada (/s.../ atau /w.../)
    let cleanUrl = url.replace(/\/s+(-[a-z]+)*\//i, '/');
    cleanUrl = cleanUrl.replace(/\/w+-h+-c(-[a-z]+)*\//i, '/');

    // Rakit parameter rekayasa CDN baru
    const cropFlag = crop ? '-c' : '';
    const parameterString = `/w${width}-h${height}${cropFlag}-rw/`;

    // Sisipkan parameter tepat sebelum nama file gambar di akhir URL path
    const urlParts = cleanUrl.split('/');
    const fileName = urlParts.pop();

    return [...urlParts, parameterString, fileName].join('/');
  }
};

