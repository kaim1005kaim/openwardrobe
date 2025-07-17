/**
 * 4枚組画像から指定された象限の画像を抽出する
 * @param imageUrl - 元画像のURL
 * @param quadrant - 象限番号 (1: 左上, 2: 右上, 3: 左下, 4: 右下)
 * @returns 抽出された画像のBlobURL
 */
export async function extractQuadrantFromImage(imageUrl: string, quadrant: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // 元画像の半分のサイズを計算
      const halfWidth = img.width / 2;
      const halfHeight = img.height / 2;
      
      // キャンバスサイズを設定
      canvas.width = halfWidth;
      canvas.height = halfHeight;
      
      // 象限に応じた座標を計算
      let sx = 0, sy = 0;
      
      switch (quadrant) {
        case 1: // 左上
          sx = 0;
          sy = 0;
          break;
        case 2: // 右上
          sx = halfWidth;
          sy = 0;
          break;
        case 3: // 左下
          sx = 0;
          sy = halfHeight;
          break;
        case 4: // 右下
          sx = halfWidth;
          sy = halfHeight;
          break;
        default:
          reject(new Error('Invalid quadrant number'));
          return;
      }
      
      // 画像の指定された象限を描画
      ctx.drawImage(
        img,
        sx, sy, halfWidth, halfHeight,  // ソース座標とサイズ
        0, 0, halfWidth, halfHeight     // 描画先座標とサイズ
      );
      
      // キャンバスをBlobとして変換
      canvas.toBlob((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          resolve(blobUrl);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.9);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * 抽出した画像をダウンロードする
 * @param blobUrl - 抽出された画像のBlobURL
 * @param filename - ダウンロードファイル名
 */
export function downloadImageFromBlob(blobUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.click();
  
  // メモリリークを防ぐためにBlobURLを解放
  URL.revokeObjectURL(blobUrl);
}

/**
 * 画像が4枚組（2x2グリッド）形式かどうかを判定
 * @param imageUrl - 画像のURL
 * @returns 4枚組かどうかのboolean
 */
export async function isQuadrantImage(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // アスペクト比が1:1に近い場合は4枚組の可能性が高い
      const aspectRatio = img.width / img.height;
      const isSquarish = aspectRatio > 0.9 && aspectRatio < 1.1;
      resolve(isSquarish);
    };
    
    img.onerror = () => {
      resolve(false);
    };
    
    img.src = imageUrl;
  });
}