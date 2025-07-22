// Loading copy variations for different generation phases
export const LOADING_COPY = {
  uploading: [
    'アイデアをアップロード中...',
    'デザインを準備中...',
    'インスピレーションを送信中...'
  ],
  queued: [
    '順番待ち中...',
    'デザインキューに追加中...',
    'あなたの番が来るまでお待ちください...'
  ],
  generating: [
    'スタイルを縫製中...',
    '生地を裁断しています...',
    'シルエットを構築中...',
    '色味を調整中...',
    'パターンを作成中...',
    'ディテールを仕上げ中...'
  ],
  rendering: [
    '最終仕上げ中...',
    'デザインを磨き上げています...',
    'もうすぐ完成です...'
  ],
  error: [
    '接続に失敗しました',
    '一時的な問題が発生しました',
    'もう一度お試しください'
  ]
};

// Get a random copy for a given phase
export function getLoadingCopy(phase: keyof typeof LOADING_COPY): string {
  const copies = LOADING_COPY[phase];
  return copies[Math.floor(Math.random() * copies.length)];
}

// Get copy based on progress percentage
export function getProgressBasedCopy(progress: number): string {
  if (progress < 10) return getLoadingCopy('uploading');
  if (progress < 25) return getLoadingCopy('queued');
  if (progress < 90) return getLoadingCopy('generating');
  return getLoadingCopy('rendering');
}