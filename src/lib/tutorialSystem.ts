export interface TutorialStep {
  id: string;
  target: string; // CSS selector or element ID
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'none';
  delay?: number;
}

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    target: '',
    title: 'OpenWardrobeへようこそ！',
    description: 'AIを使って美しいファッションデザインを作成できるプラットフォームです。基本的な使い方をご案内します。',
    position: 'center',
    action: 'none',
    delay: 1000
  },
  {
    id: 'settings-button',
    target: '[data-tutorial="settings-button"]',
    title: 'デザイン設定を開く',
    description: '左上のアイコンをクリックして、デザイン設定パネルを開きます。ここでスタイルやプリセットを選択できます。',
    position: 'right',
    action: 'click',
    delay: 500
  },
  {
    id: 'preset-cards',
    target: '[data-tutorial="preset-cards"]',
    title: '人気のプリセット',
    description: 'プリセットを選ぶだけで、すぐにAIが美しいファッションデザインを生成します。まずはこちらを試してみましょう。',
    position: 'right',
    action: 'none',
    delay: 800
  },
  {
    id: 'quick-generate',
    target: '[data-tutorial="quick-generate"]',
    title: 'クイック生成',
    description: '個別の設定を選んで「今すぐ生成」ボタンで、カスタムデザインを作成することもできます。',
    position: 'right',
    action: 'none',
    delay: 500
  },
  {
    id: 'prompt-bar',
    target: '[data-tutorial="prompt-bar"]',
    title: 'AIプロンプト入力',
    description: '下部のプロンプトバーで、自分のアイデアを入力してAIに強化してもらうこともできます。魔法の杖アイコンでAI強化を試してみてください。',
    position: 'top',
    action: 'none',
    delay: 800
  },
  {
    id: 'image-feed',
    target: '[data-tutorial="image-feed"]',
    title: '生成されたデザイン',
    description: 'ここに生成されたファッションデザインが表示されます。画像をクリックすると詳細表示や追加の編集オプションが利用できます。',
    position: 'top',
    action: 'none',
    delay: 500
  },
  {
    id: 'complete',
    target: '',
    title: 'チュートリアル完了！',
    description: 'これでOpenWardrobeの基本的な使い方を理解していただけました。さっそく素晴らしいファッションデザインを作成してみてください！',
    position: 'center',
    action: 'none',
    delay: 1000
  }
];

export class TutorialManager {
  private static readonly STORAGE_KEY = 'openwardrobe_tutorial_completed';
  
  static isTutorialCompleted(): boolean {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }
  
  static markTutorialCompleted(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }
  
  static resetTutorial(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  static getElementPosition(selector: string): DOMRect | null {
    if (typeof window === 'undefined') return null;
    const element = document.querySelector(selector);
    return element ? element.getBoundingClientRect() : null;
  }
  
  static scrollToElement(selector: string): void {
    if (typeof window === 'undefined') return;
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }
  
  static highlightElement(selector: string): void {
    if (typeof window === 'undefined') return;
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.style.zIndex = '9999';
      element.style.position = 'relative';
    }
  }
  
  static removeHighlight(selector: string): void {
    if (typeof window === 'undefined') return;
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.style.zIndex = '';
      element.style.position = '';
    }
  }
}