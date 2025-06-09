#!/usr/bin/env node

/**
 * Script to update all translation files with missing keys
 * Adds missing translation keys from English to all supported languages
 */

const fs = require('fs');
const path = require('path');

// Supported languages and their translations for new keys
const TRANSLATIONS = {
  'features.title': {
    es: 'Características Poderosas para',
    fr: 'Fonctionnalités Puissantes pour',
    de: 'Leistungsstarke Funktionen für',
    pt: 'Recursos Poderosos para',
    ja: '強力な機能',
    ko: '강력한 기능',
    'zh-CN': '强大功能'
  },
  'features.subtitle': {
    es: 'Todo lo que necesitas para crear marcas de tiempo profesionales de YouTube rápida y sin esfuerzo',
    fr: 'Tout ce dont vous avez besoin pour créer des horodatages YouTube professionnels rapidement et sans effort',
    de: 'Alles was Sie brauchen, um professionelle YouTube-Zeitstempel schnell und mühelos zu erstellen',
    pt: 'Tudo que você precisa para criar timestamps profissionais do YouTube rápida e facilmente',
    ja: 'プロフェッショナルなYouTubeタイムスタンプを素早く簡単に作成するために必要なすべて',
    ko: '전문적인 YouTube 타임스탬프를 빠르고 쉽게 만들 수 있는 모든 것',
    'zh-CN': '快速轻松创建专业YouTube时间戳所需的一切'
  },
  'features.ctaTitle': {
    es: '¿Listo para Crear Marcas de Tiempo Perfectas?',
    fr: 'Prêt à Créer des Horodatages Parfaits?',
    de: 'Bereit für Perfekte Zeitstempel?',
    pt: 'Pronto para Criar Timestamps Perfeitos?',
    ja: '完璧なタイムスタンプを作成する準備はできましたか？',
    ko: '완벽한 타임스탬프를 만들 준비가 되셨나요?',
    'zh-CN': '准备好创建完美的时间戳了吗？'
  },
  'features.ctaSubtitle': {
    es: 'Únete a miles de creadores que confían en Easy Timestamps para sus videos de YouTube',
    fr: 'Rejoignez des milliers de créateurs qui font confiance à Easy Timestamps pour leurs vidéos YouTube',
    de: 'Schließen Sie sich Tausenden von Erstellern an, die Easy Timestamps für ihre YouTube-Videos vertrauen',
    pt: 'Junte-se a milhares de criadores que confiam no Easy Timestamps para seus vídeos do YouTube',
    ja: 'YouTubeビデオにEasy Timestampsを信頼する何千ものクリエイターに参加しましょう',
    ko: 'YouTube 동영상에 Easy Timestamps를 신뢰하는 수천 명의 크리에이터와 함께하세요',
    'zh-CN': '加入数千名信任Easy Timestamps制作YouTube视频的创作者'
  },
  'features.ctaTryNow': {
    es: 'Probar Easy Timestamps',
    fr: 'Essayer Easy Timestamps',
    de: 'Easy Timestamps Ausprobieren',
    pt: 'Experimentar Easy Timestamps',
    ja: 'Easy Timestampsを試す',
    ko: 'Easy Timestamps 사용해보기',
    'zh-CN': '试用Easy Timestamps'
  },
  'features.manualTimestamps.description': {
    es: 'A diferencia de otras herramientas sobrecargadas en el mercado, esta es simple pero poderosa. Te ayuda a crear marcas de tiempo manualmente lo que asegura precisión, pero la interfaz te ayuda a crearlas 50% más rápido, con controles desde el inicio del capítulo hasta el final del capítulo del video de YouTube.',
    fr: 'Contrairement aux autres outils surchargés du marché, celui-ci est simple mais puissant. Il vous aide à créer des horodatages manuellement ce qui assure la précision, mais l\'interface vous aide à les créer 50% plus rapidement, avec des contrôles du début du chapitre à la fin du chapitre de la vidéo YouTube.',
    de: 'Im Gegensatz zu anderen überladenen Tools auf dem Markt ist dieses einfach aber mächtig. Es hilft Ihnen dabei, Zeitstempel manuell zu erstellen, was Präzision gewährleistet, aber die Benutzeroberfläche hilft Ihnen dabei, sie 50% schneller zu erstellen, mit Kontrollen vom Anfang des Kapitels bis zum Ende des YouTube-Video-Kapitels.',
    pt: 'Ao contrário de outras ferramentas sobrecarregadas no mercado, esta é simples mas poderosa. Ajuda você a criar timestamps manualmente o que garante precisão, mas a interface ajuda você a criá-los 50% mais rápido, com controles desde o início do capítulo até o final do capítulo do vídeo do YouTube.',
    ja: '市場にある他の肥大化したツールとは異なり、これはシンプルでありながら強力です。手動でタイムスタンプを作成することで精度を保証しますが、インターフェイスはチャプターの開始からYouTubeビデオのチャプターの終了まで、50%高速に作成できるようサポートします。',
    ko: '시장의 다른 과부하된 도구들과 달리, 이것은 간단하지만 강력합니다. 수동으로 타임스탬프를 생성하여 정확성을 보장하지만, 인터페이스는 챕터 시작부터 YouTube 비디오 챕터 끝까지 50% 빠르게 생성할 수 있도록 도와줍니다.',
    'zh-CN': '与市场上其他臃肿的工具不同，这个工具简单而强大。它帮助您手动创建时间戳以确保精确性，但界面帮助您比平时快50%地创建它们，具有从章节开始到YouTube视频章节结束的控件。'
  },
  'features.manualTimestamps.points.0': {
    es: 'Interfaz simple pero poderosa',
    fr: 'Interface simple mais puissante',
    de: 'Einfache aber mächtige Benutzeroberfläche',
    pt: 'Interface simples mas poderosa',
    ja: 'シンプルでありながら強力なインターフェース',
    ko: '간단하지만 강력한 인터페이스',
    'zh-CN': '简单而强大的界面'
  },
  'features.manualTimestamps.points.1': {
    es: 'Creación 50% más rápida',
    fr: 'Création 50% plus rapide',
    de: '50% schnellere Erstellung',
    pt: 'Criação 50% mais rápida',
    ja: '50%高速な作成',
    ko: '50% 빠른 생성',
    'zh-CN': '50%更快的创建'
  },
  'features.manualTimestamps.points.2': {
    es: 'Controles precisos de capítulos',
    fr: 'Contrôles précis des chapitres',
    de: 'Präzise Kapitelsteuerung',
    pt: 'Controles precisos de capítulos',
    ja: '正確なチャプター制御',
    ko: '정확한 챕터 제어',
    'zh-CN': '精确的章节控制'
  },
  'features.videoIntegration.description': {
    es: 'Soporte para cargas de archivos MP4 y carga directa de URL de YouTube. Reproductor de video receptivo con controles precisos para una experiencia de reproducción fluida.',
    fr: 'Support pour les téléchargements de fichiers MP4 et le chargement direct d\'URL YouTube. Lecteur vidéo réactif avec des contrôles précis pour une expérience de lecture fluide.',
    de: 'Unterstützung für MP4-Datei-Uploads und direktes Laden von YouTube-URLs. Responsiver Video-Player mit präzisen Kontrollen für ein nahtloses Wiedergabeerlebnis.',
    pt: 'Suporte para uploads de arquivos MP4 e carregamento direto de URL do YouTube. Player de vídeo responsivo com controles precisos para uma experiência de reprodução fluida.',
    ja: 'MP4ファイルのアップロードと直接的なYouTube URLの読み込みをサポート。シームレスな再生体験のための正確な制御を備えた応答性の高いビデオプレーヤー。',
    ko: 'MP4 파일 업로드 및 직접 YouTube URL 로딩 지원. 원활한 재생 경험을 위한 정확한 컨트롤을 갖춘 반응형 비디오 플레이어.',
    'zh-CN': '支持MP4文件上传和直接YouTube URL加载。具有精确控制的响应式视频播放器，提供无缝播放体验。'
  },
  'features.videoIntegration.points.2': {
    es: 'Un clic para agregar capítulos personalizados',
    fr: 'Un clic pour ajouter des chapitres personnalisés',
    de: 'Ein Klick zum Hinzufügen benutzerdefinierter Kapitel',
    pt: 'Um clique para adicionar capítulos personalizados',
    ja: 'カスタムチャプターをワンクリックで追加',
    ko: '원클릭으로 사용자 정의 챕터 추가',
    'zh-CN': '一键添加自定义章节'
  },
  'features.videoIntegration.points.3': {
    es: 'Vista previa de video en tiempo real',
    fr: 'Aperçu vidéo en temps réel',
    de: 'Echtzeit-Video-Vorschau',
    pt: 'Pré-visualização de vídeo em tempo real',
    ja: 'リアルタイムビデオプレビュー',
    ko: '실시간 비디오 미리보기',
    'zh-CN': '实时视频预览'
  },
  'features.instantExport.description': {
    es: 'Copia con un clic al portapapeles en formato listo para descripción de YouTube. Diseño de marca de tiempo limpio y profesional perfecto para descripciones de video.',
    fr: 'Copie en un clic vers le presse-papiers au format prêt pour la description YouTube. Mise en page d\'horodatage propre et professionnelle parfaite pour les descriptions vidéo.',
    de: 'Ein-Klick-Kopie in die Zwischenablage im YouTube-Beschreibungs-bereiten Format. Sauberes, professionelles Zeitstempel-Layout perfekt für Video-Beschreibungen.',
    pt: 'Cópia com um clique para a área de transferência no formato pronto para descrição do YouTube. Layout de timestamp limpo e profissional perfeito para descrições de vídeo.',
    ja: 'YouTube説明用フォーマットでクリップボードにワンクリックコピー。ビデオ説明に最適なクリーンでプロフェッショナルなタイムスタンプレイアウト。',
    ko: 'YouTube 설명 준비 형식으로 클립보드에 원클릭 복사. 비디오 설명에 완벽한 깔끔하고 전문적인 타임스탬프 레이아웃.',
    'zh-CN': '一键复制到剪贴板，采用YouTube描述就绪格式。干净、专业的时间戳布局，非常适合视频描述。'
  },
  'features.instantExport.points.3': {
    es: 'Múltiples formatos de exportación',
    fr: 'Multiples formats d\'exportation',
    de: 'Mehrere Exportformate',
    pt: 'Múltiplos formatos de exportação',
    ja: '複数のエクスポート形式',
    ko: '여러 내보내기 형식',
    'zh-CN': '多种导出格式'
  },
  'features.comingSoon.description': {
    es: 'Mejora de IA y más características poderosas próximamente para hacer su creación de marcas de tiempo aún más eficiente e inteligente.',
    fr: 'Amélioration de l\'IA et plus de fonctionnalités puissantes à venir pour rendre votre création d\'horodatages encore plus efficace et intelligente.',
    de: 'KI-Verbesserung und weitere leistungsstarke Funktionen kommen bald, um Ihre Zeitstempel-Erstellung noch effizienter und intelligenter zu machen.',
    pt: 'Melhoria de IA e mais recursos poderosos em breve para tornar sua criação de timestamps ainda mais eficiente e inteligente.',
    ja: 'AI強化とより強力な機能が間もなく登場し、タイムスタンプ作成をさらに効率的でインテリジェントにします。',
    ko: 'AI 향상 및 더 강력한 기능이 곧 출시되어 타임스탬프 생성을 더욱 효율적이고 지능적으로 만들어줍니다.',
    'zh-CN': 'AI增强和更多强大功能即将推出，让您的时间戳创建更加高效和智能。'
  },
  'features.comingSoon.points.3': {
    es: 'Automatización avanzada',
    fr: 'Automatisation avancée',
    de: 'Erweiterte Automatisierung',
    pt: 'Automação avançada',
    ja: '高度な自動化',
    ko: '고급 자동화',
    'zh-CN': '高级自动化'
  }
};

// Add common translations that are missing
const COMMON_TRANSLATIONS = {
  'common.getStarted': {
    es: 'Comenzar',
    fr: 'Commencer',
    de: 'Loslegen',
    pt: 'Começar',
    ja: '始める',
    ko: '시작하기',
    'zh-CN': '开始'
  },
  'common.learnMore': {
    es: 'Saber Más',
    fr: 'En Savoir Plus',
    de: 'Mehr Erfahren',
    pt: 'Saber Mais',
    ja: 'もっと詳しく',
    ko: '더 알아보기',
    'zh-CN': '了解更多'
  },
  'common.contactUs': {
    es: 'Contáctanos',
    fr: 'Nous Contacter',
    de: 'Kontaktieren Sie Uns',
    pt: 'Entre em Contato',
    ja: 'お問い合わせ',
    ko: '문의하기',
    'zh-CN': '联系我们'
  },
  'common.tryNow': {
    es: 'Probar Ahora',
    fr: 'Essayer Maintenant',
    de: 'Jetzt Ausprobieren',
    pt: 'Experimentar Agora',
    ja: '今すぐ試す',
    ko: '지금 시도하기',
    'zh-CN': '立即试用'
  }
};

// All translations combined
const ALL_TRANSLATIONS = { ...TRANSLATIONS, ...COMMON_TRANSLATIONS };

function updateTranslationFile(langCode) {
  const filePath = path.join(__dirname, '..', 'src', 'i18n', 'locales', `${langCode}.json`);
  
  try {
    let translations = {};
    
    // Load existing translations if file exists
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      translations = JSON.parse(content);
    }
    
    console.log(`Updating ${langCode}.json...`);
    
    let addedCount = 0;
    
    // Add missing translations
    Object.entries(ALL_TRANSLATIONS).forEach(([key, langTranslations]) => {
      if (langTranslations[langCode]) {
        const keyParts = key.split('.');
        let current = translations;
        
        // Navigate to the correct nested location
        for (let i = 0; i < keyParts.length - 1; i++) {
          if (!current[keyParts[i]]) {
            current[keyParts[i]] = {};
          }
          current = current[keyParts[i]];
        }
        
        // Add the translation if it doesn't exist
        const finalKey = keyParts[keyParts.length - 1];
        if (!current[finalKey]) {
          current[finalKey] = langTranslations[langCode];
          addedCount++;
        }
      }
    });
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
    console.log(`  ✓ Added ${addedCount} new translations to ${langCode}.json`);
    
  } catch (error) {
    console.error(`  ✗ Error updating ${langCode}.json:`, error.message);
  }
}

function main() {
  console.log('🌍 Updating translation files with missing keys...\n');
  
  const supportedLanguages = ['es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh-CN'];
  
  supportedLanguages.forEach(langCode => {
    updateTranslationFile(langCode);
  });
  
  console.log('\n✅ Translation files updated successfully!');
  console.log('\nNext steps:');
  console.log('1. Review translations for accuracy');
  console.log('2. Test each language in the browser');
  console.log('3. Run translation QA: npm run translation:check');
}

if (require.main === module) {
  main();
}

module.exports = { updateTranslationFile, ALL_TRANSLATIONS };