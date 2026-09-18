import {
  getProductProfile,
  normalizeCutlineSmoothing,
  stickerOffsetPixels,
  physicalPixels,
  workDpi,
  alphaToMask,
  stripFlatBackground,
  traceContours,
  cleanContours,
  simplifyPath,
  smoothPath,
  offsetContours,
  scalePath,
  boundsOfContours,
  contoursToPathD,
  ornamentShapePoints,
  ornamentHole,
  luggageTagShapePoints,
  luggageTagHole,
  petTagShapePoints,
  bookmarkShapePoints,
  bookmarkHole,
  coasterShapePoints,
  jigsawCutPaths,
  stickerBorderWidth,
  stickerBorderHex,
  STICKER_BORDER_PRESETS,
  photoStripSize,
  photoStripCount,
  photoStripPaperHex,
  tableNumberSize,
  tableNumberShape,
  tableNumberPaperHex,
  placeCardSheet,
  placeCardStyle,
  placeCardPaperHex,
  placeCardGrid,
  placeCardGuests,
  PLACE_CARD_LIMIT,
  polaroidFrame,
  polaroidGrid,
  polaroidPaperHex,
  polaroidFinish,
  polaroidSheet,
  cupcakeTopper,
  cupcakeShape,
  cupcakeSheet,
  cupcakePaperHex,
  cupcakeGrid,
  giftTagSize,
  giftTagShape,
  giftTagSheet,
  giftTagPaperHex,
  giftTagGrid,
  giftTagHole,
  nameTracingPaper,
  nameTracingStyle,
  nameTracingRule,
  nameTracingCase,
  nameTracingInkHex,
  nameTracingText,
  nameTracingNames,
  nameTracingSlots,
  nameTracingSheet,
  NAME_TRACING_ROW_MIN,
  NAME_TRACING_ROW_MAX,
  NAME_TRACING_BLANK_MAX,
  wordSearchPaper,
  wordSearchGrid,
  wordSearchLevel,
  wordSearchTheme,
  wordSearchCase,
  wordSearchWord,
  wordSearchList,
  wordSearchAutoCells,
  wordSearchBuild,
  wordSearchPath,
  wordSearchSheet,
  wordSearchListColumns,
  WORD_SEARCH_THEMES,
  bingoPaper,
  bingoGrid,
  bingoLayout,
  bingoMode,
  bingoTheme,
  bingoCase,
  bingoEntry,
  bingoCardCount,
  bingoWords,
  bingoNeeded,
  bingoFreeCell,
  bingoNumberGrid,
  bingoWordGrid,
  bingoCardSet,
  bingoSheet,
  bingoPageCount,
  bingoCallList,
  bingoCallColumns,
  BINGO_COLUMNS,
  BINGO_THEMES,
  chartPaper,
  chartDays,
  chartStyle,
  chartTheme,
  chartRows,
  chartChores,
  chartText,
  chartSheet,
  CHART_THEMES,
  CHART_SAMPLE,
  mulType,
  mulRange,
  mulFill,
  mulSquares,
  mulOrient,
  mulShowsAnswer,
  mulSheet,
  MUL_SAMPLE,
  crownStyle,
  crownBand,
  crownSheet,
  CROWN_SAMPLE,
  readableInk,
  jigsawGrid,
  polylineToPathD,
  deskNamePlatePoints,
  deskNamePlateSize,
  isNamePlateFinish,
  widthAtY,
  cakeTopperBarRect,
  cakeTopperPlaque,
  isCakeTopperStyle,
  photoBlockSize,
  sizeOptionLabel,
  coloringPaper,
  coloringStyle,
  coloringDetail,
  coloringWeight,
  coloringPage,
  lineWeightPx,
  lineRadiusPx,
  fitBox,
  grayscalePlane,
  boxBlurPlane,
  posterizePlane,
  boundaryMask,
  differenceOfGaussians,
  quantileThreshold,
  maskAbove,
  dilateMask,
  despeckleMask,
  maskInkRatio,
  PRINT_DPI,
} from "./assets/maker-core.mjs";

const CANVAS = 900;
const WORK_LONG_SIDE = 620;
// Coloring sheets trace their line art above the preview's own DPI, because a 0.5 mm hairline and a
// 1.4 mm line land on the same pixel at preview resolution and the weight control would look dead.
const COLORING_PREVIEW_DPI = 120;
const LIFT_LONG_SIDE = 2400;
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const DEFAULT_NAME_FONT = "'Playfair Display', Georgia, serif";
const DEFAULT_TOPPER_FONT = "'Playfair Display', Georgia, 'Times New Roman', serif";
const TOPPER_MAX_CHARS = 24;
const TOPPER_INK = "#1d2420";
const DEFAULT_STRIP_FONT = "'Trebuchet MS', 'Segoe UI', sans-serif";
const STRIP_MAX_PHOTOS = 4;
const DEFAULT_TABLE_NUMBER_FONT = "'Playfair Display', Georgia, 'Times New Roman', serif";
const DEFAULT_PLACE_CARD_FONT = "'Playfair Display', Georgia, 'Times New Roman', serif";
const DEFAULT_POLAROID_FONT = "'Brush Script MT', 'Segoe Script', cursive";
const DEFAULT_CUPCAKE_FONT = "'Playfair Display', Georgia, 'Times New Roman', serif";
const CUPCAKE_MAX_CHARS = 40;
const DEFAULT_GIFT_TAG_FONT = "'Playfair Display', Georgia, 'Times New Roman', serif";
const GIFT_TAG_MAX_CHARS = 32;
const GIFT_TAG_FIELD_MAX = 22;
const COLORING_INK = "#141414";

const root = document.querySelector("[data-maker]");
const profile = getProductProfile(root.dataset.maker);
const canvas = document.querySelector("#preview");
const ctx = canvas.getContext("2d");
const upload = document.querySelector("#photo");
const sizeSelect = document.querySelector("#size");
const sizeLabel = document.querySelector("#sizeLabel");
const shapeSelect = document.querySelector("#shape");
const nameInput = document.querySelector("#nameText");
const nameFont = document.querySelector("#nameFont");
const offsetInput = document.querySelector("#offset");
const offsetLabel = document.querySelector("#offsetLabel");
const offsetControl = document.querySelector("#offsetControl");
const smoothingInput = document.querySelector("#smoothing");
const smoothingControl = document.querySelector("#smoothingControl");
const smoothingLabel = document.querySelector("#smoothingLabel");
const dimensions = document.querySelector("#dimensions");
const pngButton = document.querySelector("#pngDownload");
const svgButton = document.querySelector("#svgDownload");
const engravingInput = document.querySelector("#engraving");
const contactInput = document.querySelector("#contact");
const topperText = document.querySelector("#topperText");
const topperFont = document.querySelector("#topperFont");
const topperStyle = document.querySelector("#topperStyle");
const plateName = document.querySelector("#plaqueName");
const plateTitle = document.querySelector("#plaqueTitle");
const plateCompany = document.querySelector("#plaqueCompany");
const finishSelect = document.querySelector("#finish");
const borderColorInput = document.querySelector("#borderColor");
const stripCountSelect = document.querySelector("#stripCount");
const stripCaptionInput = document.querySelector("#stripCaption");
const stripFontSelect = document.querySelector("#stripFont");
const stripPaperInput = document.querySelector("#stripPaper");
const stripClearButton = document.querySelector("#stripClear");
const tableNumberText = document.querySelector("#tableNumber");
const tableNumberNames = document.querySelector("#tableName");
const tableNumberFont = document.querySelector("#tableFont");
const tableNumberPaper = document.querySelector("#tablePaper");
const tableNumberClear = document.querySelector("#tableClear");
const placeCardList = document.querySelector("#placeList");
const placeCardFont = document.querySelector("#placeFont");
const placeCardPaper = document.querySelector("#placePaper");
const placeCardPager = document.querySelector("#placePager");
const placeCardPagePrev = document.querySelector("#placePagePrev");
const placeCardPageNext = document.querySelector("#placePageNext");
const placeCardPageLabel = document.querySelector("#placePageLabel");
const polaroidCaption = document.querySelector("#polaroidCaption");
const polaroidFontSelect = document.querySelector("#polaroidFont");
const polaroidPaper = document.querySelector("#polaroidPaper");
const polaroidFinishSelect = document.querySelector("#polaroidFinish");
const cupcakeText = document.querySelector("#cupcakeText");
const cupcakeFontSelect = document.querySelector("#cupcakeFont");
const cupcakePaper = document.querySelector("#cupcakePaper");
const cupcakeSheetSelect = document.querySelector("#cupcakeSheet");
const giftTagText = document.querySelector("#giftText");
const giftTagTo = document.querySelector("#giftTo");
const giftTagFrom = document.querySelector("#giftFrom");
const giftTagFontSelect = document.querySelector("#giftFont");
const giftTagPaper = document.querySelector("#giftPaper");
const giftTagSheetSelect = document.querySelector("#giftSheet");
const traceName = document.querySelector("#traceName");
const traceRows = document.querySelector("#traceRows");
const traceBlanks = document.querySelector("#traceBlanks");
const traceStyle = document.querySelector("#traceStyle");
const traceRule = document.querySelector("#traceRule");
const traceCase = document.querySelector("#traceCase");
const traceInk = document.querySelector("#traceInk");
const traceGuide = document.querySelector("#traceGuide");
const tracePager = document.querySelector("#tracePager");
const tracePagePrev = document.querySelector("#tracePagePrev");
const tracePageNext = document.querySelector("#tracePageNext");
const tracePageLabel = document.querySelector("#tracePageLabel");
const wsTitle = document.querySelector("#wsTitle");
const wsWords = document.querySelector("#wsWords");
const wsTheme = document.querySelector("#wsTheme");
const wsSize = document.querySelector("#wsSize");
const wsSizeLabel = document.querySelector("#wsSizeLabel");
const wsLevel = document.querySelector("#wsLevel");
const wsCase = document.querySelector("#wsCase");
const wsAnswers = document.querySelector("#wsAnswers");
const wsShuffle = document.querySelector("#wsShuffle");
const bcTitle = document.querySelector("#bingoTitle");
const bcMode = document.querySelector("#bingoMode");
const bcWords = document.querySelector("#bingoWords");
const bcTheme = document.querySelector("#bingoTheme");
const bcGrid = document.querySelector("#bingoGrid");
const bcLayout = document.querySelector("#bingoLayout");
const bcCount = document.querySelector("#bingoCount");
const bcFree = document.querySelector("#bingoFree");
const bcCase = document.querySelector("#bingoCase");
const bcCallList = document.querySelector("#bingoCallList");
const bcShuffle = document.querySelector("#bingoShuffle");
const bcSizeLabel = document.querySelector("#bingoSizeLabel");
const bcPager = document.querySelector("#bingoPager");
const bcPagePrev = document.querySelector("#bingoPagePrev");
const bcPageNext = document.querySelector("#bingoPageNext");
const bcPageLabel = document.querySelector("#bingoPageLabel");
const chartTitleInput = document.querySelector("#chartTitle");
const chartNameInput = document.querySelector("#chartName");
const chartChoresInput = document.querySelector("#chartChores");
const chartDaysSelect = document.querySelector("#chartDays");
const chartRowsInput = document.querySelector("#chartRows");
const chartStyleSelect = document.querySelector("#chartStyle");
const chartThemeSelect = document.querySelector("#chartTheme");
const chartRewardInput = document.querySelector("#chartReward");
const chartSizeLabel = document.querySelector("#chartSizeLabel");
const crownNameInput = document.querySelector("#crownName");
const crownStyleSelect = document.querySelector("#crownStyle");
const crownBandSelect = document.querySelector("#crownBand");
const crownThemeSelect = document.querySelector("#crownTheme");
const mulTitleInput = document.querySelector("#mulTitle");
const mulNameInput = document.querySelector("#mulName");
const mulTypeSelect = document.querySelector("#mulType");
const mulRangeSelect = document.querySelector("#mulRange");
const mulFillSelect = document.querySelector("#mulFill");
const mulSquaresSelect = document.querySelector("#mulSquares");
const mulThemeSelect = document.querySelector("#mulTheme");
const mulOrientSelect = document.querySelector("#mulOrient");
const mulSizeLabel = document.querySelector("#mulSizeLabel");
const coloringStyleSelect = document.querySelector("#coloringStyle");
const coloringDetailSelect = document.querySelector("#coloringDetail");
const coloringWeightSelect = document.querySelector("#coloringWeight");
const coloringOrientationSelect = document.querySelector("#coloringOrientation");
const coloringInvertInput = document.querySelector("#coloringInvert");

let image = null;
let imageDataUrl = "";
let namePhoto = null;
let topperPhoto = null;
let plateLogo = null;
let stripPhotos = [];
let tablePhoto = null;
let placeCardPage = 0;
// A tracing batch can hold a whole class list, so the sheet being previewed is paged like place cards.
let tracePage = 0;
// A polaroid can be downloaded as a blank film frame, so the upload lives beside the shared
// artwork slot instead of replacing the placeholder the shared export path expects.
let polaroidPhoto = null;
// A cupcake topper can be printed blank, so the upload lives beside the placeholder artwork.
let cupcakePhoto = null;
// A gift tag can be printed blank or filled with a photo, so the upload lives beside the slot.
let giftTagPhoto = null;
// A coloring page does not need artwork of its own: the sheet alone is a usable download, so the
// uploaded photo is kept beside the blank placeholder the shared export path expects.
let coloringPhoto = null;
let rawContours = null;
let backgroundLifted = false;
let liftedCanvas = null;
let rawSource = { width: 0, height: 0 };
let scene = null;
let raf = 0;
// A word search is rebuilt from the same seed until the visitor shuffles it, so the grid only
// changes when they ask it to.
let wsSeed = 1;
// A bingo set is rebuilt from the same seed until the visitor shuffles it, and a long run pages
// across several sheets, so the seed and the sheet in view are kept together.
let bingoSeed = 1;
let bingoPage = 0;

/** The font every worksheet row is set in. Trebuchet is the clearest of the five loaded faces for a child to trace. */
const NAME_TRACING_FONT = "'Trebuchet MS', 'Segoe UI', sans-serif";

/** The puzzle grid is plain type, so it uses the same neutral sans face and print-safe inks. */
const WORD_SEARCH_FONT = "'Trebuchet MS', 'Segoe UI', sans-serif";
const WORD_SEARCH_INK = "#1f2429";
const WORD_SEARCH_RULE = "#d3d8dd";
const WORD_SEARCH_ANSWER = "rgba(244, 197, 79, 0.55)";

/** A bingo card is high-contrast print, so the head band is solid ink and the free square a soft gold. */
const BINGO_FONT = "'Trebuchet MS', 'Segoe UI', sans-serif";
const BINGO_INK = "#1f2429";
const BINGO_RULE = "#c9cfd6";
const BINGO_HEAD_FILL = "#1f2429";
const BINGO_FREE_FILL = "#f4c54f";

/** The chart is plain type plus simple print-safe marks, so it uses the same neutral sans face. */
const CHART_FONT = "'Trebuchet MS', 'Segoe UI', sans-serif";

boot();

function boot() {
  document.querySelector("#productName").textContent = profile.product;
  sizeSelect.innerHTML = profile.sizes
    .map((cm) => '<option value="' + cm + '">' + sizeOptionLabel(profile, cm) + "</option>")
    .join("");
  if (!profile.exportSvg) {
    if (svgButton) svgButton.hidden = true;
    if (offsetControl) offsetControl.hidden = true;
    if (smoothingControl) smoothingControl.hidden = true;
  }
  setDownloadsEnabled(false);
  upload?.addEventListener("change", onUpload);
  sizeSelect.addEventListener("change", schedule);
  shapeSelect?.addEventListener("change", schedule);
  if (profile.id === "name-keychain") {
    nameInput?.addEventListener("input", onNameInput);
    nameFont?.addEventListener("change", onNameInput);
    generateNameArtwork();
  }
  if (profile.id === "cake-topper") {
    topperText?.addEventListener("input", onTopperInput);
    topperFont?.addEventListener("change", onTopperInput);
    topperStyle?.addEventListener("change", onTopperInput);
    generateTopperArtwork();
  }
  if (profile.id === "name-plate") {
    [plateName, plateTitle, plateCompany].forEach((input) => input?.addEventListener("input", schedule));
    finishSelect?.addEventListener("change", schedule);
    // The plate is built from type plus an optional logo, so finished artwork exists the
    // moment the page opens and the downloads never have to wait for an upload.
    image = namePlateBlank();
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "photo-strip") {
    stripCountSelect?.addEventListener("change", schedule);
    stripCaptionInput?.addEventListener("input", schedule);
    stripFontSelect?.addEventListener("change", schedule);
    stripPaperInput?.addEventListener("input", schedule);
    stripClearButton?.addEventListener("click", clearStripPhotos);
    // A strip is laid out from the product size rather than from an upload, so a blank canvas
    // stands in for the artwork and the shared preview and download plumbing keeps working.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "table-number") {
    tableNumberText?.addEventListener("input", schedule);
    tableNumberNames?.addEventListener("input", schedule);
    tableNumberFont?.addEventListener("change", schedule);
    tableNumberPaper?.addEventListener("input", schedule);
    tableNumberClear?.addEventListener("click", clearTableNumberPhoto);
    // The card is typed rather than uploaded, so a blank canvas stands in for the artwork and
    // the shared preview and download plumbing works before any photo is added.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "place-card") {
    placeCardList?.addEventListener("input", () => { placeCardPage = 0; schedule(); });
    placeCardFont?.addEventListener("change", schedule);
    placeCardPaper?.addEventListener("input", schedule);
    placeCardPagePrev?.addEventListener("click", () => { placeCardPage -= 1; render(); });
    placeCardPageNext?.addEventListener("click", () => { placeCardPage += 1; render(); });
    // A place card is typed rather than uploaded, so a blank canvas stands in for the artwork and
    // the shared preview and download plumbing works before a single name is typed.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "polaroid") {
    polaroidCaption?.addEventListener("input", schedule);
    polaroidFontSelect?.addEventListener("change", schedule);
    polaroidPaper?.addEventListener("input", schedule);
    polaroidFinishSelect?.addEventListener("change", schedule);
    // The film frame is a fixed shape, so a blank placeholder stands in for the artwork and the
    // shared preview and download plumbing works before a single photo is added.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "cupcake") {
    cupcakeText?.addEventListener("input", () => schedule());
    cupcakeFontSelect?.addEventListener("change", schedule);
    cupcakePaper?.addEventListener("input", schedule);
    cupcakeSheetSelect?.addEventListener("change", schedule);
    // A topper is cut from card stock, so a blank placeholder stands in for the artwork and
    // the shared preview and download plumbing works before a single photo is added.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "gift-tag") {
    giftTagText?.addEventListener("input", () => schedule());
    giftTagTo?.addEventListener("input", () => schedule());
    giftTagFrom?.addEventListener("input", () => schedule());
    giftTagFontSelect?.addEventListener("change", schedule);
    giftTagPaper?.addEventListener("input", schedule);
    giftTagSheetSelect?.addEventListener("change", schedule);
    // A tag is cut from card stock, so a blank placeholder stands in for the artwork and the
    // shared preview and download plumbing works before a single photo is added.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "name-tracing") {
    traceName?.addEventListener("input", () => { tracePage = 0; schedule(); });
    traceRows?.addEventListener("change", schedule);
    traceBlanks?.addEventListener("change", schedule);
    traceStyle?.addEventListener("change", schedule);
    traceRule?.addEventListener("change", schedule);
    traceCase?.addEventListener("change", schedule);
    traceInk?.addEventListener("input", schedule);
    traceGuide?.addEventListener("change", schedule);
    tracePagePrev?.addEventListener("click", () => { tracePage -= 1; render(); });
    tracePageNext?.addEventListener("click", () => { tracePage += 1; render(); });
    // A worksheet is typed rather than uploaded, so a blank page stands in for the artwork and
    // the shared preview and download plumbing works before a single name is entered.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "bingo") {
    // The theme list is a shared recipe rather than a hand-written set of options, so the two stay
    // in step. A card is drawn from numbers or typed words, so a blank canvas stands in.
    if (bcTheme) {
      bcTheme.innerHTML = '<option value="">Choose a theme...</option>'
        + BINGO_THEMES.map((theme) => '<option value="' + theme.id + '">' + theme.label + "</option>").join("");
    }
    bcTitle?.addEventListener("input", schedule);
    bcMode?.addEventListener("change", schedule);
    bcWords?.addEventListener("input", () => { bingoSeed = 1; bingoPage = 0; schedule(); });
    bcTheme?.addEventListener("change", applyBingoTheme);
    bcGrid?.addEventListener("change", () => { bingoPage = 0; schedule(); });
    bcLayout?.addEventListener("change", () => { bingoPage = 0; schedule(); });
    bcCount?.addEventListener("input", () => { bingoPage = 0; schedule(); });
    bcFree?.addEventListener("change", schedule);
    bcCase?.addEventListener("change", schedule);
    bcCallList?.addEventListener("change", () => { bingoPage = 0; schedule(); });
    bcShuffle?.addEventListener("click", () => { bingoSeed = (bingoSeed % 4294967295) + 1; bingoPage = 0; schedule(); });
    bcPagePrev?.addEventListener("click", () => { bingoPage -= 1; render(); });
    bcPageNext?.addEventListener("click", () => { bingoPage += 1; render(); });
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "crown-maker") {
    // A crown is typed rather than uploaded, so a blank canvas stands in for the artwork slot and
    // the colour kits come from the same shared recipe as the other printable sheets.
    if (crownThemeSelect) {
      crownThemeSelect.innerHTML = '<option value="">Choose a colour kit...</option>'
        + CHART_THEMES.map((theme) => '<option value="' + theme.id + '">' + theme.label + "</option>").join("");
    }
    crownNameInput?.addEventListener("input", schedule);
    crownStyleSelect?.addEventListener("change", schedule);
    crownBandSelect?.addEventListener("change", schedule);
    crownThemeSelect?.addEventListener("change", schedule);
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "chore-chart") {
    // The theme list is a shared recipe rather than a hand-written set of options, so the two stay
    // in step. A chart is typed rather than uploaded, so a blank canvas stands in.
    if (chartThemeSelect) {
      chartThemeSelect.innerHTML = '<option value="">Choose a colour kit...</option>'
        + CHART_THEMES.map((theme) => '<option value="' + theme.id + '">' + theme.label + "</option>").join("");
    }
    chartTitleInput?.addEventListener("input", schedule);
    chartNameInput?.addEventListener("input", schedule);
    chartChoresInput?.addEventListener("input", schedule);
    chartDaysSelect?.addEventListener("change", schedule);
    chartRowsInput?.addEventListener("input", schedule);
    chartStyleSelect?.addEventListener("change", schedule);
    chartThemeSelect?.addEventListener("change", schedule);
    chartRewardInput?.addEventListener("input", schedule);
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "multiplication-chart") {
    // The colour kits come from the same shared recipe as the chore chart, so the two printable
    // sheets never drift apart. A chart is typed rather than uploaded, so a blank canvas stands in.
    if (mulThemeSelect) {
      mulThemeSelect.innerHTML = '<option value="">Choose a colour kit...</option>'
        + CHART_THEMES.map((theme) => '<option value="' + theme.id + '">' + theme.label + "</option>").join("");
    }
    mulTitleInput?.addEventListener("input", schedule);
    mulNameInput?.addEventListener("input", schedule);
    mulTypeSelect?.addEventListener("change", schedule);
    mulRangeSelect?.addEventListener("change", schedule);
    mulFillSelect?.addEventListener("change", schedule);
    mulSquaresSelect?.addEventListener("change", schedule);
    mulThemeSelect?.addEventListener("change", schedule);
    mulOrientSelect?.addEventListener("change", schedule);
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "word-search") {
    // The theme list is a shared recipe rather than a hand-written set of options, so the two stay
    // in step. A puzzle is typed, so a blank canvas stands in for the artwork slot.
    if (wsTheme) {
      wsTheme.innerHTML = '<option value="">Choose a theme...</option>'
        + WORD_SEARCH_THEMES.map((theme) => '<option value="' + theme.id + '">' + theme.label + "</option>").join("");
    }
    wsTitle?.addEventListener("input", schedule);
    wsWords?.addEventListener("input", () => { wsSeed = 1; schedule(); });
    wsTheme?.addEventListener("change", applyWordSearchTheme);
    wsSize?.addEventListener("change", schedule);
    wsLevel?.addEventListener("change", schedule);
    wsCase?.addEventListener("change", schedule);
    wsAnswers?.addEventListener("change", schedule);
    wsShuffle?.addEventListener("click", () => { wsSeed = (wsSeed % 4294967295) + 1; schedule(); });
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "coloring") {
    coloringStyleSelect?.addEventListener("change", schedule);
    coloringDetailSelect?.addEventListener("change", schedule);
    coloringWeightSelect?.addEventListener("change", schedule);
    coloringOrientationSelect?.addEventListener("change", schedule);
    coloringInvertInput?.addEventListener("change", schedule);
    // The sheet itself is the product, so a blank page stands in for the artwork and the shared
    // preview and download plumbing works before a single photo is added.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  offsetInput?.addEventListener("input", schedule);
  borderColorInput?.addEventListener("input", schedule);
  wireHexPresets(borderColorInput, "#borderPresets", "data-border", schedule);
  wireHexPresets(stripPaperInput, "#stripPaperPresets", "data-paper", schedule);
  wireHexPresets(tableNumberPaper, "#tableNumberPaperPresets", "data-paper", schedule);
  wireHexPresets(placeCardPaper, "#placePaperPresets", "data-paper", schedule);
  wireHexPresets(polaroidPaper, "#polaroidPaperPresets", "data-paper", schedule);
  wireHexPresets(cupcakePaper, "#cupcakePaperPresets", "data-paper", schedule);
  wireHexPresets(giftTagPaper, "#giftPaperPresets", "data-paper", schedule);
  wireHexPresets(traceInk, "#traceInkPresets", "data-ink", schedule);
  smoothingInput?.addEventListener("input", schedule);
  engravingInput?.addEventListener("input", schedule);
  contactInput?.addEventListener("input", schedule);
  document.querySelector("#sampleArtwork")?.addEventListener("click", loadSample);
  pngButton.addEventListener("click", () => { if (image) exportPng(); });
  svgButton?.addEventListener("click", () => { if (image) exportSvg(); });
  track("page_view", { product: profile.id });
  if (new URLSearchParams(location.search).get("sample") === "1") loadSample();
}

/**
 * The one-shot colour buttons shared by the sticker border and the strip paper. A click fills
 * the real colour input, so the swatch and the picker can never disagree about the value.
 */
function wireHexPresets(input, containerSelector, attribute, onChange) {
  const buttons = document.querySelectorAll(containerSelector + " button[" + attribute + "]");
  if (!buttons.length) return;
  const sync = () => {
    const current = String((input && input.value) || "").toLowerCase();
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", button.getAttribute(attribute).toLowerCase() === current ? "true" : "false");
    });
  };
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!input) return;
      input.value = button.getAttribute(attribute);
      sync();
      onChange();
    });
  });
  input?.addEventListener("input", sync);
  sync();
}

function setDownloadsEnabled(enabled) {
  pngButton.disabled = !enabled;
  if (svgButton) svgButton.disabled = !enabled;
  root.classList.toggle("has-image", enabled);
}

function schedule() {
  if (!image || raf) return;
  raf = requestAnimationFrame(() => { raf = 0; render(); });
}

// ------------------------------------------------------------------ name artwork

let nameTimer = 0;

function onNameInput() {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(generateNameArtwork, 200);
}

async function generateNameArtwork() {
  const text = (nameInput?.value || "").trim().slice(0, 16);
  if (!text) {
    image = null;
    setDownloadsEnabled(false);
    return note("Type a name to see the acrylic keychain shape.");
  }
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (error) { /* fall back to the system face */ }
  const ok = await adoptImage(nameArtworkCanvas(text, nameFont?.value || DEFAULT_NAME_FONT, namePhoto).toDataURL("image/png"));
  if (ok) track("name_rendered", { characters: text.length, photo: !!namePhoto });
}

/**
 * Draws the name as solid artwork with a welded hanging tab on top.
 * The tab keeps the drilled hole on real material for every letter combination,
 * which a hole punched straight into a letter would not.
 */
function nameArtworkCanvas(text, family, photo) {
  const FONT_SIZE = 260;
  const INK = "#1d2420";
  const probe = document.createElement("canvas").getContext("2d");
  probe.font = `700 ${FONT_SIZE}px ${family}`;
  const metrics = probe.measureText(text);
  const textW = Math.max(96, Math.ceil(metrics.width));
  const textH = Math.ceil(FONT_SIZE * 1.06);
  const padX = Math.max(30, Math.round(textW * 0.05));
  const tabH = Math.round(textH * 0.34);
  const W = textW + padX * 2;
  const H = textH + tabH;
  const baseline = tabH + textH / 2 + FONT_SIZE * 0.015;

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  g.clearRect(0, 0, W, H);

  // The welded hanging tab always stays solid ink so the drilled hole sits on real material,
  // whichever letters follow underneath.
  const tabW = Math.max(58, Math.round(Math.min(W * 0.17, textH * 0.36)));
  g.fillStyle = INK;
  g.beginPath();
  roundRect(g, W / 2 - tabW / 2, 0, tabW, tabH + textH * 0.42, tabW * 0.42);
  g.fill();

  if (photo && photo.naturalWidth) {
    // Photo lettering: draw the glyphs on a scratch layer, then clip the photo into them.
    const glyphs = document.createElement("canvas");
    glyphs.width = W;
    glyphs.height = H;
    const gg = glyphs.getContext("2d");
    gg.fillStyle = "#000";
    gg.textAlign = "center";
    gg.textBaseline = "middle";
    gg.font = `700 ${FONT_SIZE}px ${family}`;
    gg.fillText(text, W / 2, baseline);
    gg.globalCompositeOperation = "source-in";
    const cover = Math.max(W / photo.naturalWidth, (textH * 1.45) / photo.naturalHeight);
    const dw = photo.naturalWidth * cover;
    const dh = photo.naturalHeight * cover;
    gg.drawImage(photo, (W - dw) / 2, baseline - dh / 2, dw, dh);
    g.drawImage(glyphs, 0, 0);
  } else {
    g.fillStyle = INK;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = `700 ${FONT_SIZE}px ${family}`;
    g.fillText(text, W / 2, baseline);
  }
  return c;
}

// ------------------------------------------------------------------ cake topper artwork

let topperTimer = 0;

/** The selected lettering style, falling back to the safest cut shape. */
function topperStyleName() {
  const value = topperStyle?.value;
  return isCakeTopperStyle(value) ? value : "cutout";
}

function topperTextValue() {
  return (topperText?.value || "").trim().slice(0, TOPPER_MAX_CHARS);
}

function onTopperInput() {
  clearTimeout(topperTimer);
  topperTimer = setTimeout(generateTopperArtwork, 180);
}

async function generateTopperArtwork() {
  const text = topperTextValue();
  if (!text) {
    image = null;
    setDownloadsEnabled(false);
    return note("Type a name or a short message to see the acrylic cake topper shape.");
  }
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (error) { /* fall back to the installed face */ }
  const ok = await adoptImage(topperArtworkCanvas(text, topperFont?.value || DEFAULT_TOPPER_FONT, topperStyleName()).toDataURL("image/png"));
  if (ok) track("topper_rendered", { characters: text.length, style: topperStyleName() });
}

/**
 * The ink the cut path is traced from. Three shapes are sold:
 *   cutout - bare letters, best for a single word in a connected face;
 *   bar    - letters welded onto one horizontal band, so "Happy Birthday" ships as one piece;
 *   plaque - a solid disc with the wording cut through it as a stencil.
 * The offered faces deliberately avoid very heavy display fonts such as Arial Black or
 * Impact, whose tight counters trace into unreadable slivers at cutting size.
 */
function topperArtworkCanvas(text, family, style) {
  const SIZE = 340;
  const WEIGHT = 700;
  const probe = document.createElement("canvas").getContext("2d");
  probe.font = WEIGHT + " " + SIZE + "px " + family;
  const metrics = probe.measureText(text);
  const ascent = Math.max(1, metrics.actualBoundingBoxAscent || SIZE * 0.74);
  const descent = Math.max(0, metrics.actualBoundingBoxDescent || SIZE * 0.2);
  const textW = Math.max(60, Math.ceil(metrics.width));

  if (style === "plaque") {
    // A round plaque is sized from the wording so a short name and a long message both keep
    // a readable margin between the letters and the outside edge.
    const size = Math.round(Math.max(textW * 1.75, (ascent + descent) * 2.6, 720));
    const disc = document.createElement("canvas");
    disc.width = size;
    disc.height = size;
    const d = disc.getContext("2d");
    const plaque = cakeTopperPlaque(size, size);
    d.fillStyle = TOPPER_INK;
    d.beginPath();
    d.arc(plaque.cx, plaque.cy, plaque.r, 0, Math.PI * 2);
    d.fill();
    // Punching the wording out of the disc leaves a stencil that still cuts as one piece.
    d.globalCompositeOperation = "destination-out";
    d.textAlign = "center";
    d.textBaseline = "middle";
    const inner = fitFont(d, text, plaque.r * 1.3, plaque.r * 0.6, family, WEIGHT);
    d.font = WEIGHT + " " + inner + "px " + family;
    d.fillText(text, plaque.cx, plaque.cy);
    d.globalCompositeOperation = "source-over";
    return disc;
  }

  const padX = Math.max(28, Math.round(textW * 0.06));
  const padTop = Math.round((ascent + descent) * 0.12);
  const baseline = padTop + ascent;
  const width = textW + padX * 2;
  const bar = style === "bar" ? cakeTopperBarRect(width, baseline, ascent, descent) : null;
  const inkBottom = bar ? bar.y + bar.h : baseline + descent;
  const height = Math.ceil(inkBottom + Math.round((ascent + descent) * 0.08));

  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const g = c.getContext("2d");
  g.fillStyle = TOPPER_INK;
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  g.font = WEIGHT + " " + SIZE + "px " + family;
  if (bar) g.fillRect(bar.x, bar.y, bar.w, bar.h);
  g.fillText(text, width / 2, baseline);
  return c;
}

// ------------------------------------------------------------------ upload

async function onUpload() {
  const file = upload.files && upload.files[0];
  if (!file) return;
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return note("That file type is not supported. Use PNG, JPG or WEBP.");
  if (file.size > MAX_UPLOAD_BYTES) return note("That image is larger than 12 MB. Please resize it first.");

  if (profile.id === "name-keychain") {
    // Optional photo ink: the letters keep their shape and the photo fills them.
    note("Loading your photo...");
    const nameDataUrl = await fileToDataUrl(file);
    try {
      namePhoto = await loadImage(nameDataUrl);
    } catch (error) {
      namePhoto = null;
      return note("We could not read that photo. Please try another file.");
    }
    track("photo_uploaded", { tool: "name-keychain", width: namePhoto.naturalWidth, height: namePhoto.naturalHeight });
    await generateNameArtwork();
    return;
  }

  if (profile.id === "cake-topper") {
    // A photo is optional ink: it fills the letters, the welding bar or the round plaque.
    note("Loading your photo...");
    const topperDataUrl = await fileToDataUrl(file);
    try {
      topperPhoto = await loadImage(topperDataUrl);
    } catch (error) {
      topperPhoto = null;
      return note("We could not read that photo. Please try another file.");
    }
    track("photo_uploaded", { tool: "cake-topper", width: topperPhoto.naturalWidth, height: topperPhoto.naturalHeight });
    await generateTopperArtwork();
    return;
  }
  if (profile.id === "name-plate") {
    // The upload is the optional logo mark, not the plate itself; the plate keeps its type.
    note("Loading your logo...");
    const logoDataUrl = await fileToDataUrl(file);
    try {
      plateLogo = await loadImage(logoDataUrl);
    } catch (error) {
      plateLogo = null;
      return note("We could not read that image. Please try another file.");
    }
    track("photo_uploaded", { tool: "name-plate", width: plateLogo.naturalWidth, height: plateLogo.naturalHeight });
    render();
    return;
  }

  if (profile.id === "photo-strip") {
    // A strip takes a small set of photos instead of one, so every file is read and the first
    // four become the frames. Uploading again adds to the strip rather than replacing it.
    const files = Array.from(upload.files || []).filter((entry) => /^image\/(png|jpeg|webp)$/.test(entry.type));
    if (!files.length) return note("Use PNG, JPG or WebP photos.");
    note("Loading your photos...");
    for (const entry of files) {
      if (stripPhotos.length >= STRIP_MAX_PHOTOS) break;
      if (entry.size > MAX_UPLOAD_BYTES) continue;
      try {
        stripPhotos.push(await loadImage(await fileToDataUrl(entry)));
      } catch (error) {
        // One unreadable file must not throw away the photos that did load.
      }
    }
    if (!stripPhotos.length) return note("We could not read those photos. Please try another set.");
    setDownloadsEnabled(true);
    adoptSource("upload");
    render();
    track("photo_uploaded", { tool: "photo-strip", photos: stripPhotos.length });
    return;
  }

  note("Loading your image...");
  const dataUrl = await fileToDataUrl(file);
  const ok = await adoptImage(dataUrl);
  if (!ok) return;
  track("photo_uploaded", { width: image.naturalWidth, height: image.naturalHeight });
}

/** Single place where a data URL becomes the active artwork. */
async function adoptImage(dataUrl) {
  try {
    imageDataUrl = dataUrl;
    image = await loadImage(dataUrl);
  } catch (error) {
    image = null;
    if (profile.id === "table-number") tablePhoto = null;
    if (profile.id === "cupcake") cupcakePhoto = null;
    if (profile.id === "gift-tag") giftTagPhoto = null;
    if (profile.id === "coloring") coloringPhoto = null;
    setDownloadsEnabled(false);
    note("We could not read that image. Please try another file.");
    return false;
  }
  // A polaroid can be downloaded blank, so the photo is kept beside the placeholder artwork.
  if (profile.id === "polaroid") polaroidPhoto = image;
  // A cupcake topper can be printed blank, so the photo is kept beside the placeholder artwork.
  if (profile.id === "cupcake") cupcakePhoto = image;
  // A gift tag can be printed blank, so the photo is kept beside the placeholder artwork.
  if (profile.id === "gift-tag") giftTagPhoto = image;
  // A coloring page is drawn from the photo itself, so the upload is kept for the line-art pass.
  if (profile.id === "coloring") coloringPhoto = image;
  // A table number keeps its photo beside the typed number, so it is remembered here rather
  // than read back off the shared artwork slot.
  if (profile.id === "table-number") tablePhoto = image;
  rawContours = null;
  backgroundLifted = false;
  liftedCanvas = null;
  // Only the cutline tool traces the picture itself, so only it re-keys a flat backdrop.
  if (profile.id === "sticker" || profile.id === "sticker-outline") liftFlatArtwork();
  // Only the two tools whose cut line follows the picture itself trace contours.
  if (profile.id === "sticker" || profile.id === "sticker-outline" || profile.id === "cake-topper") extractContours();
  setDownloadsEnabled(true);
  adoptSource("upload");
  render();
  return true;
}

/**
 * A JPEG carries no transparency, so an opaque upload would trace back as one big rectangle.
 * When the picture is fully opaque and framed by an even backdrop, that backdrop is lifted out
 * first: the tracer then has a real silhouette to follow, and because the painter draws this
 * lifted canvas the downloaded white border is not painted over by the photo's own background.
 * A busy border is left alone, and the work is capped so a phone photo stays quick.
 */
function liftFlatArtwork() {
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const ratio = Math.min(1, LIFT_LONG_SIDE / longest);
  const lw = Math.max(2, Math.round(image.naturalWidth * ratio));
  const lh = Math.max(2, Math.round(image.naturalHeight * ratio));
  const work = document.createElement("canvas");
  work.width = lw;
  work.height = lh;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  wctx.imageSmoothingQuality = "high";
  wctx.drawImage(image, 0, 0, lw, lh);
  const pixels = wctx.getImageData(0, 0, lw, lh).data;
  let opaque = 0;
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 18) opaque++;
  if (opaque < lw * lh * 0.96) return;
  const stripped = stripFlatBackground(pixels, lw, lh);
  if (!stripped.applied) return;
  wctx.putImageData(new ImageData(stripped.pixels, lw, lh), 0, 0);
  liftedCanvas = work;
  backgroundLifted = true;
}

/** The picture the tracer and the sticker painter should work from. */
function artworkSource() {
  return liftedCanvas || image;
}

/** Trace the artwork outline once per upload; parameter changes reuse this cache. */
function extractContours() {
  // Lettering traces into a cleaner cut line than a photo outline does, so the topper tool
  // works at a finer resolution and scales the finished path back down for the preview.
  const traceLongSide = profile.id === "cake-topper" ? 1400 : WORK_LONG_SIDE;
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const ratio = Math.min(1, traceLongSide / longest);
  const sw = Math.max(2, Math.round(image.naturalWidth * ratio));
  const sh = Math.max(2, Math.round(image.naturalHeight * ratio));
  const work = document.createElement("canvas");
  work.width = sw;
  work.height = sh;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  wctx.imageSmoothingQuality = "high";
  wctx.drawImage(artworkSource(), 0, 0, sw, sh);
  const pixels = wctx.getImageData(0, 0, sw, sh).data;
  const mask = alphaToMask(pixels, sw, sh, 18);
  const minArea = Math.max(16, sw * sh * 0.000015);
  const maxContours = profile.id === "cake-topper" ? 80 : 24;
  rawContours = cleanContours(traceContours(mask, sw, sh), minArea, maxContours);
  rawSource = { width: sw, height: sh };
  if (!rawContours.length) note("This image is fully transparent, so there is nothing to trace. Try a PNG with visible artwork.");
}

/** A ready-made theme fills the word box; the visitor can then edit the list however they like. */
function applyWordSearchTheme() {
  const theme = wordSearchTheme(wsTheme?.value);
  if (!theme) return;
  if (wsWords) wsWords.value = theme.words.join("\n");
  wsSeed = 1;
  schedule();
}

/** A ready-made theme fills the word box and switches the card to word mode, ready to print. */
function applyBingoTheme() {
  const theme = bingoTheme(bcTheme?.value);
  if (!theme) return;
  if (bcWords) bcWords.value = theme.words.join("\n");
  if (bcMode) bcMode.value = "words";
  bingoSeed = 1;
  bingoPage = 0;
  schedule();
}

// ------------------------------------------------------------------ layout + render

function layout() {
  if (profile.id === "polaroid") {
    // A polaroid is bought as film, so the frame decides the shape of the box and the sheet
    // only decides how many of them are tiled onto one printable page.
    const frame = polaroidFrame(sizeSelect.value);
    const sheet = polaroidSheet(shapeSelect?.value);
    const spec = sheet || frame;
    const longCm = Math.max(spec.widthCm, spec.heightCm);
    const scale = WORK_LONG_SIDE / longCm;
    const w = Math.round(spec.widthCm * scale);
    const h = Math.round(spec.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: longCm, dpi: workDpi(WORK_LONG_SIDE, longCm), frame, sheet };
  }
  if (profile.id === "cupcake") {
    // A topper is cut from card stock, so the disc decides the box and the sheet only decides
    // how many of them are tiled onto one printable page.
    const topper = cupcakeTopper(sizeSelect.value);
    const sheet = cupcakeSheet(cupcakeSheetSelect?.value);
    const spec = sheet || topper;
    const longCm = Math.max(spec.widthCm, spec.heightCm);
    const scale = WORK_LONG_SIDE / longCm;
    const w = Math.round(spec.widthCm * scale);
    const h = Math.round(spec.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: longCm, dpi: workDpi(WORK_LONG_SIDE, longCm), topper, sheet };
  }
  if (profile.id === "gift-tag") {
    // A tag is cut from card stock, so the tag decides the box and the sheet only decides how
    // many of them are tiled onto one printable page.
    const tag = giftTagSize(sizeSelect.value);
    const sheet = giftTagSheet(giftTagSheetSelect?.value);
    const spec = sheet || tag;
    const longCm = Math.max(spec.widthCm, spec.heightCm);
    const scale = WORK_LONG_SIDE / longCm;
    const w = Math.round(spec.widthCm * scale);
    const h = Math.round(spec.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: longCm, dpi: workDpi(WORK_LONG_SIDE, longCm), tag, sheet };
  }
  if (profile.id === "name-tracing") {
    // The worksheet is the product, so the paper decides the box and the row recipe decides
    // where every ruled line falls. Preview and print both read the same sheet layout.
    const paper = nameTracingPaper(sizeSelect.value);
    const sheet = nameTracingSheet({
      paper,
      rows: traceRows?.value,
      blankRows: traceBlanks?.value,
      guide: traceGuide?.checked !== false,
    });
    const scale = WORK_LONG_SIDE / paper.heightCm;
    const w = Math.round(paper.widthCm * scale);
    const h = Math.round(paper.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: paper.heightCm, dpi: workDpi(WORK_LONG_SIDE, paper.heightCm), paper, sheet };
  }
  if (profile.id === "bingo") {
    // The sheet is the product, so the paper decides the box and the card layout decides where
    // every card falls at both preview and print resolution.
    const paper = bingoPaper(sizeSelect.value);
    const sheet = bingoSheet({ paper, layout: bcLayout?.value });
    const scale = WORK_LONG_SIDE / paper.heightCm;
    const w = Math.round(paper.widthCm * scale);
    const h = Math.round(paper.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: paper.heightCm, dpi: workDpi(WORK_LONG_SIDE, paper.heightCm), paper, sheet };
  }
  if (profile.id === "crown-maker") {
    // A crown band runs along the long edge of the page, so the paper is turned to landscape and
    // the recipe decides where each band and each point falls at preview and print resolution.
    const paper = chartPaper(sizeSelect.value);
    const sheet = crownSheet({ paper, style: crownStyleSelect?.value, band: crownBandSelect?.value });
    const longCm = Math.max(sheet.widthCm, sheet.heightCm);
    const scale = WORK_LONG_SIDE / longCm;
    const w = Math.round(sheet.widthCm * scale);
    const h = Math.round(sheet.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: longCm, dpi: workDpi(WORK_LONG_SIDE, longCm), paper, sheet };
  }
  if (profile.id === "chore-chart") {
    // The sheet is the product, so the paper decides the box and the chore rows decide where
    // every line falls at both preview and print resolution.
    const paper = chartPaper(sizeSelect.value);
    const sheet = chartSheet({ paper, days: chartDaysSelect?.value, rows: chartRowsInput?.value });
    const scale = WORK_LONG_SIDE / paper.heightCm;
    const w = Math.round(paper.widthCm * scale);
    const h = Math.round(paper.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: paper.heightCm, dpi: workDpi(WORK_LONG_SIDE, paper.heightCm), paper, sheet };
  }
  if (profile.id === "multiplication-chart") {
    // The sheet is the product, so the paper and the orientation decide the box, and the grid
    // recipe decides where every cell falls at both preview and print resolution.
    const paper = chartPaper(sizeSelect.value);
    const sheet = mulSheet({ paper, orient: mulOrientSelect?.value, type: mulTypeSelect?.value, max: mulRangeSelect?.value });
    const longCm = Math.max(sheet.widthCm, sheet.heightCm);
    const scale = WORK_LONG_SIDE / longCm;
    const w = Math.round(sheet.widthCm * scale);
    const h = Math.round(sheet.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: longCm, dpi: workDpi(WORK_LONG_SIDE, longCm), paper, sheet };
  }
  if (profile.id === "word-search") {
    // The sheet is the product, so the paper decides the box and the grid recipe decides where
    // every cell falls at both preview and print resolution.
    const paper = wordSearchPaper(sizeSelect.value);
    const words = wordSearchList(wsWords?.value);
    const grid = wordSearchGrid(wsSize?.value);
    const cells = grid.id === "auto" ? wordSearchAutoCells(words) : grid.cells;
    const sheet = wordSearchSheet({ paper, cells });
    const scale = WORK_LONG_SIDE / paper.heightCm;
    const w = Math.round(paper.widthCm * scale);
    const h = Math.round(paper.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: paper.heightCm, dpi: workDpi(WORK_LONG_SIDE, paper.heightCm), paper, sheet, cells, grid };
  }
  if (profile.id === "coloring") {
    // The sheet is the product, so the paper decides the box and the photo simply fits inside
    // the printer margin. The preview works at its own DPI and the download is rebuilt at 300.
    const paper = coloringPaper(sizeSelect.value);
    const orientation = coloringOrientationSelect?.value === "landscape" ? "landscape" : "portrait";
    const longCm = Math.max(paper.widthCm, paper.heightCm);
    const dpi = workDpi(WORK_LONG_SIDE, longCm);
    const page = coloringPage(paper.id, orientation, dpi);
    const sheet = coloringPage(paper.id, orientation, COLORING_PREVIEW_DPI);
    const w = page.widthPx;
    const h = page.heightPx;
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: longCm, dpi, page, sheet };
  }
  if (profile.id === "photo-strip") {
    // A strip is a fixed 2 in wide column of photos, so the product size decides the box
    // instead of the uploads. The scene carries the strip height as its print long side.
    const spec = photoStripSize(sizeSelect.value);
    const h = WORK_LONG_SIDE;
    const w = Math.round(h * (spec.widthCm / spec.heightCm));
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: spec.heightCm, dpi: workDpi(h, spec.heightCm), spec };
  }
  if (profile.id === "table-number") {
    // A table number is sold as a print size, so the card decides the box instead of an upload
    // and the number and the optional photo simply follow the stock.
    const spec = tableNumberSize(sizeSelect.value);
    const h = WORK_LONG_SIDE;
    const w = Math.round(h * (spec.widthCm / spec.heightCm));
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: spec.heightCm, dpi: workDpi(h, spec.heightCm), spec, shape: tableNumberShape(shapeSelect?.value) };
  }
  if (profile.id === "place-card") {
    // A place card is sold as a sheet the couple prints themselves, so the paper decides the box
    // and the card grid is worked out from the sheet and the chosen card style.
    const spec = placeCardSheet(sizeSelect.value);
    const h = WORK_LONG_SIDE;
    const w = Math.round(h * (spec.widthCm / spec.heightCm));
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: spec.heightCm, dpi: workDpi(h, spec.heightCm), spec };
  }
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const ratio = WORK_LONG_SIDE / longest;
  let w = image.naturalWidth * ratio;
  let h = image.naturalHeight * ratio;
  const longSideCm = Number(sizeSelect.value);
  const shape = profile.id === "photo-keychain"
    ? (shapeSelect?.value || "rounded")
    : profile.id === "ornament"
      ? (shapeSelect?.value || "round")
      : profile.id === "luggage-tag"
        ? (shapeSelect?.value || "rounded")
      : profile.id === "pet-tag"
        ? (shapeSelect?.value || "circle")
      : profile.id === "bookmark"
        ? (shapeSelect?.value || "classic")
      : profile.id === "coaster"
        ? (shapeSelect?.value || "square")
        : "";
  let topBand = 0;
  let pad = 0;

  if (profile.id === "photo-keychain" && shape !== "rounded") {
    const side = Math.max(w, h);
    w = side;
    h = side;
  }

  if (profile.id === "photo-keychain") {
    topBand = Math.max(46, Math.min(w, h) * 0.13);
    pad = Math.max(14, Math.min(w, h) * 0.075);
    const outerW = w + pad * 2;
    const outerH = h + pad * 2 + topBand;
    const x = (CANVAS - outerW) / 2 + pad;
    const y = (CANVAS - outerH) / 2 + topBand + pad;
    return { x, y, w, h, longSideCm, dpi: workDpi(WORK_LONG_SIDE, longSideCm), shape, topBand, pad };
  }

  if (profile.id === "name-keychain") {
    const nx = (CANVAS - w) / 2;
    const ny = (CANVAS - h) / 2;
    return { x: nx, y: ny, w, h, longSideCm, dpi: workDpi(WORK_LONG_SIDE, longSideCm) };
  }

  if (profile.id === "ornament") {
    // The silhouette decides the box; the photo is cover-fitted into whatever shape it is.
    const w = WORK_LONG_SIDE;
    const h = shape === "oval" ? Math.round(WORK_LONG_SIDE * 0.78) : WORK_LONG_SIDE;
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm, dpi: workDpi(Math.max(w, h), longSideCm), shape };
  }

  if (profile.id === "block") {
    // A photo block is sold by its face size, so the product size decides the box and the
    // photo is cover-fitted into the front face instead of setting the shape itself.
    const spec = photoBlockSize(longSideCm);
    const h = WORK_LONG_SIDE;
    const w = Math.round(h * (spec.widthCm / spec.heightCm));
    const depth = Math.round(Math.min(w, h) * 0.075);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 12;
    return { x, y, w, h, longSideCm, dpi: workDpi(h, longSideCm), spec, depth };
  }

  if (profile.id === "luggage-tag" || profile.id === "pet-tag") {
    // A tag is a portrait slab, so the silhouette aspect is fixed here instead of by the
    // uploaded photo. That keeps a 7/9/11 cm tag looking like a tag for every upload.
    const box = shape === "circle" ? [1, 1]
      : shape === "oval" ? [1, 0.72]
      : shape === "tag" ? [0.6, 1]
      : [0.66, 1];
    const w = Math.round(WORK_LONG_SIDE * box[0]);
    const h = Math.round(WORK_LONG_SIDE * box[1]);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm, dpi: workDpi(Math.max(w, h), longSideCm), shape };
  }

  if (profile.id === "bookmark") {
    // A bookmark is a tall narrow slab, so the silhouette aspect is fixed here instead of
    // by the uploaded photo. That keeps a 15, 18 or 20 cm bookmark looking like a bookmark.
    const w = Math.round(WORK_LONG_SIDE * 0.29);
    const h = WORK_LONG_SIDE;
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm, dpi: workDpi(h, longSideCm), shape };
  }

  if (profile.id === "coaster") {
    // A coaster is a fixed 1:1 blank, so the photo is cover-fitted into the footprint
    // instead of setting the silhouette the way a keychain upload does.
    const side = WORK_LONG_SIDE;
    const x = (CANVAS - side) / 2;
    const y = (CANVAS - side) / 2 + 26;
    return { x, y, w: side, h: side, longSideCm, dpi: workDpi(side, longSideCm), shape };
  }

  if (profile.id === "jigsaw") {
    // The board follows the photo so the pieces stay close to square whatever the crop is.
    // The aspect is clamped so a panorama does not collapse into a letterbox strip.
    const w = WORK_LONG_SIDE;
    const ratio = Math.min(1.5, Math.max(0.66, image.naturalHeight / image.naturalWidth));
    const h = Math.round(w * ratio);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2;
    return { x, y, w, h, longSideCm, dpi: workDpi(w, longSideCm), shape: shapeSelect?.value || "4x4" };
  }

  if (profile.id === "name-plate") {
    // A desk plate is a fixed long slab, so the inch size decides the box instead of the
    // uploaded file. The 4:1 preview keeps the real proportions of a 2 inch tall plate.
    const spec = deskNamePlateSize(longSideCm);
    const w = WORK_LONG_SIDE;
    const h = Math.round(w * (spec.heightCm / spec.widthCm));
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2;
    return { x, y, w, h, longSideCm, dpi: workDpi(w, spec.widthCm), spec, finish: plateFinish() };
  }

  const baseRoom = profile.hasBase ? 76 : 0;
  const x = (CANVAS - w) / 2;
  const y = (CANVAS - h - baseRoom) / 2;
  return {
    x,
    y,
    w,
    h,
    longSideCm,
    dpi: workDpi(WORK_LONG_SIDE, longSideCm),
  };
}

function render() {
  const L = layout();
  ctx.clearRect(0, 0, CANVAS, CANVAS);

  if (profile.id === "sticker" || profile.id === "sticker-outline") {
    const base = buildStickerContours(L);
    // The border is measured against the artwork's own DPI, not the padded canvas,
    // otherwise a 2 mm border grows into a 3.3 mm one on a shape that floats inside the frame.
    const baseBounds = boundsOfContours(base);
    const artDpi = baseBounds ? Math.max(baseBounds.width, baseBounds.height) / (L.longSideCm / 2.54) : L.dpi;
    const borderMm = stickerBorderWidth(offsetInput.value);
    const offsetPx = stickerOffsetPixels(borderMm, artDpi);
    const outline = offsetContours(base, offsetPx);
    const kind = profile.id === "sticker" ? "sticker" : "sticker-outline";
    scene = {
      kind,
      base,
      outline,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      image: artworkSource(),
      offsetPx,
      borderMm,
      dpi: artDpi,
      longSideCm: L.longSideCm,
      border: kind === "sticker-outline" ? stickerBorderHex(borderColorInput && borderColorInput.value) : "#ffffff",
    };
    if (kind === "sticker") drawSticker(ctx, scene, true);
    else drawStickerOutline(ctx, scene, true);
  } else if (profile.id === "photo-strip") {
    const stripCount = photoStripCount(stripCountSelect?.value);
    scene = {
      kind: "photo-strip",
      spec: L.spec,
      count: stripCount,
      photos: stripPhotos.slice(0, stripCount),
      paper: photoStripPaperHex(stripPaperInput?.value),
      caption: (stripCaptionInput?.value || "").trim().replace(/\s+/g, " ").slice(0, 40),
      font: stripFontSelect?.value || DEFAULT_STRIP_FONT,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawPhotoStrip(ctx, scene, true);
  } else if (profile.id === "table-number") {
    scene = {
      kind: "table-number",
      spec: L.spec,
      shape: L.shape,
      number: (tableNumberText?.value || "").trim().slice(0, 4),
      names: (tableNumberNames?.value || "").trim().replace(/\s+/g, " ").slice(0, 40),
      photo: tablePhoto,
      paper: tableNumberPaperHex(tableNumberPaper?.value),
      font: tableNumberFont?.value || DEFAULT_TABLE_NUMBER_FONT,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawTableNumber(ctx, scene, true);
  } else if (profile.id === "place-card") {
    const guests = placeCardGuests(placeCardList?.value || "", PLACE_CARD_LIMIT);
    const grid = placeCardGrid(sizeSelect.value, shapeSelect?.value);
    const pages = Math.max(1, Math.ceil(guests.length / grid.perSheet));
    if (placeCardPage > pages - 1) placeCardPage = pages - 1;
    if (placeCardPage < 0) placeCardPage = 0;
    scene = {
      kind: "place-card",
      spec: L.spec,
      grid,
      guests,
      page: placeCardPage,
      pages,
      paper: placeCardPaperHex(placeCardPaper?.value),
      font: placeCardFont?.value || DEFAULT_PLACE_CARD_FONT,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawPlaceCardSheet(ctx, scene, true);
  } else if (profile.id === "polaroid") {
    scene = {
      kind: "polaroid",
      frame: L.frame,
      spec: L.frame,
      sheet: L.sheet,
      grid: L.sheet ? polaroidGrid(L.sheet.id, sizeSelect.value) : null,
      paper: polaroidPaperHex(polaroidPaper?.value),
      finish: polaroidFinish(polaroidFinishSelect?.value),
      caption: (polaroidCaption?.value || "").trim().replace(/\s+/g, " ").slice(0, 48),
      font: polaroidFontSelect?.value || DEFAULT_POLAROID_FONT,
      image: polaroidPhoto,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawPolaroid(ctx, scene, true);
  } else if (profile.id === "cupcake") {
    scene = {
      kind: "cupcake",
      topper: L.topper,
      spec: L.topper,
      sheet: L.sheet,
      grid: L.sheet ? cupcakeGrid(L.sheet.id, sizeSelect.value) : null,
      shape: cupcakeShape(shapeSelect?.value),
      paper: cupcakePaperHex(cupcakePaper?.value),
      text: (cupcakeText?.value || "").trim().replace(/\s+/g, " ").slice(0, CUPCAKE_MAX_CHARS),
      font: cupcakeFontSelect?.value || DEFAULT_CUPCAKE_FONT,
      image: cupcakePhoto,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawCupcake(ctx, scene, true);
  } else if (profile.id === "gift-tag") {
    scene = {
      kind: "gift-tag",
      tag: L.tag,
      spec: L.tag,
      sheet: L.sheet,
      grid: L.sheet ? giftTagGrid(L.sheet.id, sizeSelect.value) : null,
      shape: giftTagShape(shapeSelect?.value),
      paper: giftTagPaperHex(giftTagPaper?.value),
      text: (giftTagText?.value || "").trim().replace(/\s+/g, " ").slice(0, GIFT_TAG_MAX_CHARS),
      to: (giftTagTo?.value || "").trim().replace(/\s+/g, " ").slice(0, GIFT_TAG_FIELD_MAX),
      from: (giftTagFrom?.value || "").trim().replace(/\s+/g, " ").slice(0, GIFT_TAG_FIELD_MAX),
      font: giftTagFontSelect?.value || DEFAULT_GIFT_TAG_FONT,
      image: giftTagPhoto,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawGiftTag(ctx, scene, true);
  } else if (profile.id === "name-tracing") {
    // One name per page keeps a whole class list printable in register order, so the batch is
    // split into pages here and the pager only ever moves the visible sheet.
    const names = nameTracingNames(traceName?.value || "");
    const pages = Math.max(1, names.length);
    if (tracePage > pages - 1) tracePage = pages - 1;
    if (tracePage < 0) tracePage = 0;
    scene = {
      kind: "name-tracing",
      paper: nameTracingPaper(sizeSelect.value),
      sheet: L.sheet,
      names,
      text: names.length ? nameTracingText(names[tracePage], traceCase?.value) : "",
      page: tracePage,
      pages,
      style: nameTracingStyle(traceStyle?.value),
      rule: nameTracingRule(traceRule?.value),
      ink: nameTracingInkHex(traceInk?.value),
      guide: traceGuide?.checked !== false,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawNameTracing(ctx, scene, true);
  } else if (profile.id === "bingo") {
    // The set is rebuilt from the same list, grid and seed the layout sized, so a shuffle only
    // changes which entries land where and never the paper the cards print on.
    const modeId = bingoMode(bcMode?.value).id;
    const words = bingoWords(bcWords?.value);
    const count = bingoCardCount(bcCount?.value);
    const grid = bingoGrid(bcGrid?.value);
    // A free square only fits the middle of an odd-numbered card, so the option steps aside on a
    // grid that has no centre cell instead of sitting there doing nothing.
    const freeAllowed = grid.cells % 2 === 1;
    if (bcFree) {
      bcFree.disabled = !freeAllowed;
      const freeRow = bcFree.closest("label");
      if (freeRow) freeRow.style.display = freeAllowed ? "" : "none";
    }
    const free = !!bcFree?.checked;
    const cards = bingoCardSet({ cells: grid.id, mode: modeId, count, free, words, seed: bingoSeed });
    const callListOn = !!bcCallList?.checked;
    const callList = bingoCallList({ mode: modeId, words, seed: bingoSeed });
    const perSheet = L.sheet.layout.cols * L.sheet.layout.rows;
    const cardSheets = Math.max(1, Math.ceil(cards.length / perSheet));
    const pages = bingoPageCount({ layout: L.sheet.layout.id, count, callList: callListOn });
    if (bingoPage > pages - 1) bingoPage = pages - 1;
    if (bingoPage < 0) bingoPage = 0;
    scene = {
      kind: "bingo",
      paper: L.paper,
      sheet: L.sheet,
      cards,
      words,
      modeId,
      count,
      cells: grid.cells,
      perSheet,
      cardSheets,
      callList,
      callListOn,
      page: bingoPage,
      pages,
      title: (bcTitle?.value || "").trim().replace(/\s+/g, " ").slice(0, 40),
      caseId: bingoCase(bcCase?.value).id,
      free,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawBingo(ctx, scene, true);
  } else if (profile.id === "crown-maker") {
    // The crown is rebuilt from the same fields the layout sized, so a name, a style or a band
    // change lands on the same printed paper instead of reflowing the sheet.
    const style = crownStyle(crownStyleSelect?.value);
    const band = crownBand(crownBandSelect?.value);
    const theme = chartTheme(crownThemeSelect?.value);
    scene = {
      kind: "crown-maker",
      paper: L.paper,
      sheet: L.sheet,
      styleId: style.id,
      bandId: band.id,
      name: chartText(crownNameInput?.value, 22),
      themeId: theme.id,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawCrown(ctx, scene, true);
  } else if (profile.id === "chore-chart") {
    // The chart is drawn from the same fields the layout sized, so every change lands on the
    // same printed paper instead of reflowing the whole sheet.
    const daySet = chartDays(chartDaysSelect?.value);
    const style = chartStyle(chartStyleSelect?.value);
    const theme = chartTheme(chartThemeSelect?.value);
    scene = {
      kind: "chore-chart",
      paper: L.paper,
      sheet: L.sheet,
      days: daySet,
      rows: L.sheet.rows,
      chores: chartChores(chartChoresInput?.value),
      title: chartText(chartTitleInput?.value, 34),
      name: chartText(chartNameInput?.value, 18),
      reward: chartText(chartRewardInput?.value, 34),
      styleId: style.id,
      themeId: theme.id,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawChoreChart(ctx, scene, true);
  } else if (profile.id === "multiplication-chart") {
    // The chart is rebuilt from the same fields the layout sized, so a range, a fill or an
    // orientation change lands on the same printed paper instead of reflowing the sheet.
    const type = mulType(mulTypeSelect?.value);
    const range = mulRange(mulRangeSelect?.value);
    const fill = mulFill(mulFillSelect?.value);
    const squares = mulSquares(mulSquaresSelect?.value);
    const orient = mulOrient(mulOrientSelect?.value);
    const theme = chartTheme(mulThemeSelect?.value);
    scene = {
      kind: "multiplication-chart",
      paper: L.paper,
      sheet: L.sheet,
      type: type.id,
      range: range.id,
      max: L.sheet.max,
      orient: orient.id,
      title: chartText(mulTitleInput?.value, 34),
      name: chartText(mulNameInput?.value, 18),
      fillId: fill.id,
      squaresId: squares.id,
      themeId: theme.id,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawMultiplicationChart(ctx, scene, true);
  } else if (profile.id === "word-search") {
    // The puzzle is rebuilt from the same word list, level and seed the layout sized, so a shuffle
    // only changes where the words sit and never the sheet they print on.
    const words = wordSearchList(wsWords?.value);
    scene = {
      kind: "word-search",
      paper: L.paper,
      sheet: L.sheet,
      build: wordSearchBuild(words, { cells: L.cells, level: wsLevel?.value, seed: wsSeed }),
      words,
      title: (wsTitle?.value || "").trim().replace(/\s+/g, " ").slice(0, 60),
      caseId: wordSearchCase(wsCase?.value).id,
      answers: !!wsAnswers?.checked,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawWordSearch(ctx, scene, true);
  } else if (profile.id === "coloring") {
    scene = {
      kind: "coloring",
      page: L.page,
      sheet: L.sheet,
      style: coloringStyle(coloringStyleSelect?.value),
      detail: coloringDetail(coloringDetailSelect?.value),
      weight: coloringWeight(coloringWeightSelect?.value),
      invert: !!coloringInvertInput?.checked,
      photo: coloringPhoto,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    // The sheet is traced at COLORING_PREVIEW_DPI DPI and then scaled onto the artboard, so the weight
    // and the detail the visitor picks are the same decisions the 300 DPI download will make.
    scene.canvas = coloringPageCanvas(scene.sheet, scene);
    drawColoringPage(ctx, scene, true);
  } else if (profile.id === "photo-keychain") {
    const geometry = photoKeychainGeometry(L);
    scene = {
      kind: "photo-keychain",
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outer: geometry.outer,
      hole: geometry.hole,
      shape: L.shape,
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawPhotoKeychain(ctx, scene, true);
  } else if (profile.id === "name-keychain") {
    scene = { kind: "name-keychain", rect: { x: L.x, y: L.y, w: L.w, h: L.h }, hole: nameHole(L), image, dpi: L.dpi, longSideCm: L.longSideCm };
    drawNameKeychain(ctx, scene, true);
  } else if (profile.id === "cake-topper") {
    scene = {
      kind: "cake-topper",
      style: topperStyleName(),
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline: topperOutline(L),
      image: topperPhoto,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawCakeTopper(ctx, scene, true);
  } else if (profile.id === "ornament") {
    const outline = ornamentShapePoints(L.shape, L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]);
    const local = ornamentHole(L.shape, L.w, L.h);
    scene = {
      kind: "ornament",
      shape: L.shape,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline,
      hole: { cx: local.cx + L.x, cy: local.cy + L.y, r: local.r },
      text: ornamentText(),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawOrnament(ctx, scene, true);
  } else if (profile.id === "luggage-tag" || profile.id === "pet-tag") {
    // A pet tag is the same slab as a bag tag, so it shares the painter and only swaps the
    // outline builder, which defaults to a collar-friendly circle.
    const tagPoints = profile.id === "pet-tag" ? petTagShapePoints : luggageTagShapePoints;
    const outline = tagPoints(L.shape, L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]);
    const local = luggageTagHole(L.shape, L.w, L.h);
    scene = {
      kind: "luggage-tag",
      shape: L.shape,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline,
      hole: { cx: local.cx + L.x, cy: local.cy + L.y, r: local.r },
      lines: luggageTagLines(),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawLuggageTag(ctx, scene, true);
  } else if (profile.id === "bookmark") {
    const outline = bookmarkShapePoints(L.shape, L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]);
    const local = bookmarkHole(L.shape, L.w, L.h);
    scene = {
      kind: "bookmark",
      shape: L.shape,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline,
      hole: { cx: local.cx + L.x, cy: local.cy + L.y, r: local.r },
      lines: bookmarkLines(),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawBookmark(ctx, scene, true);
  } else if (profile.id === "block") {
    scene = {
      kind: "block",
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      spec: L.spec,
      depth: L.depth,
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawBlock(ctx, scene, true);
  } else if (profile.id === "coaster") {
    scene = {
      kind: "coaster",
      shape: L.shape,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline: coasterShapePoints(L.shape, L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawCoaster(ctx, scene, true);
  } else if (profile.id === "jigsaw") {
    const grid = jigsawGrid(shapeSelect?.value);
    const paths = jigsawCutPaths(L.w, L.h, grid.cols, grid.rows);
    const shift = (points) => points.map(([px, py]) => [px + L.x, py + L.y]);
    scene = {
      kind: "jigsaw",
      grid,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline: shift(paths.outline),
      cuts: paths.cuts.map(shift),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawJigsaw(ctx, scene, true);
  } else if (profile.id === "name-plate") {
    scene = {
      kind: "name-plate",
      finish: plateFinish(),
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline: deskNamePlatePoints(L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]),
      lines: namePlateLines(),
      logo: plateLogo,
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
      spec: L.spec,
    };
    drawNamePlate(ctx, scene, true);
  } else if (profile.id === "magnet") {
    scene = { kind: "magnet", rect: { x: L.x, y: L.y, w: L.w, h: L.h }, image, dpi: L.dpi, longSideCm: L.longSideCm };
    drawMagnet(ctx, scene);
  } else {
    scene = { kind: "standee", rect: { x: L.x, y: L.y, w: L.w, h: L.h }, image, dpi: L.dpi, longSideCm: L.longSideCm };
    drawStandee(ctx, scene);
  }
  readout(L);
}

function buildStickerContours(L) {
  if (!rawContours || !rawContours.length) return [];
  const strength = normalizeCutlineSmoothing(smoothingInput?.value);
  const sx = L.w / rawSource.width;
  const sy = L.h / rawSource.height;
  const tolerance = Math.max(0.6, Math.min(L.w, L.h) / 420);
  return rawContours.map((contour) => {
    const simplified = simplifyPath(contour, tolerance);
    const smoothed = smoothPath(simplified, strength);
    return scalePath(smoothed, sx, sy).map(([x, y]) => [x + L.x, y + L.y]);
  });
}

function readout(L) {
  sizeLabel.textContent = scene.spec
    ? (profile.id === "table-number" || profile.id === "place-card" || profile.id === "polaroid" || profile.id === "cupcake" || profile.id === "gift-tag") && scene.spec.short
      ? scene.spec.short
      : scene.spec.id.split("x").join(" x ") + " in"
    : L.longSideCm + " cm";
  if (offsetLabel) offsetLabel.textContent = `${Number(offsetInput.value)} mm`;
  if (smoothingLabel) smoothingLabel.textContent = String(normalizeCutlineSmoothing(smoothingInput?.value));
  if (profile.id === "block") {
    // Photo blocks are bought in inches, so the readout leads with inches and keeps 300 DPI honest.
    const spec = scene.spec;
    const inches = (cm) => round2(cm / 2.54);
    dimensions.textContent = inches(spec.widthCm) + " x " + inches(spec.heightCm)
      + " in acrylic photo block at " + PRINT_DPI + " DPI ("
      + physicalPixels(L.longSideCm, PRINT_DPI) + " px long side) - transparent PNG, no watermark;"
      + " the block edge and drop shadow are a 3D preview only.";
    return;
  }

  if (profile.id === "name-plate") {
    // Desk plates are bought in inches, so the readout leads with the inch size and keeps 300 DPI honest.
    const spec = scene.spec;
    const inches = (cm) => round2(cm / 2.54);
    dimensions.textContent = inches(spec.widthCm) + " x " + inches(spec.heightCm)
      + " in acrylic desk name plate at " + PRINT_DPI + " DPI ("
      + physicalPixels(spec.widthCm, PRINT_DPI) + " px wide) - a transparent PNG plus an SVG cut path;"
      + " the stand in the preview is decoration only.";
    return;
  }

  if (profile.id === "photo-strip") {
    // The printed width is what a strip is sold as and the frame count is what makes it a booth
    // strip rather than a plain print, so the readout leads with both.
    const spec = scene.spec;
    const sheet = (spec.cols || 1) > 1
      ? " Two identical strips share the sheet, so one 4 x 6 in photo print gives you two - cut straight down the middle."
      : "";
    const missing = scene.count - scene.photos.length;
    dimensions.textContent = spec.id.split("x").join(" x ") + " in photo strip with " + scene.count
      + " photos at " + PRINT_DPI + " DPI (" + physicalPixels(spec.heightCm, PRINT_DPI) + " px long side)." + sheet
      + (scene.caption ? " Your caption prints under the frames." : "")
      + (missing > 0
        ? " Add " + missing + " more photo" + (missing === 1 ? "" : "s") + " to fill every frame."
        : " Every frame is filled, so the download is ready to print.")
      + " No watermark, and the photos never leave your device.";
    return;
  }

  if (profile.id === "table-number") {
    // The card is a print, so the readout leads with the stock and says what is actually on it.
    const spec = scene.spec;
    const shapeName = scene.shape === "arch" ? "arch" : scene.shape === "rounded" ? "rounded corner" : "straight edge";
    dimensions.textContent = spec.short + " " + shapeName + " table number at " + PRINT_DPI + " DPI ("
      + physicalPixels(spec.heightCm, PRINT_DPI) + " px tall) - a print-ready PNG of the whole card, paper and all."
      + (scene.photo
        ? " Your photo runs across the card with the number on a band of paper, so it stays readable."
        : " Add a photo when you want the picture to run across the card behind the number.")
      + (scene.names ? " The names print under the number." : "")
      + (scene.number ? "" : " Type a table number to put it on the card.")
      + " No watermark, and the photos never leave your device.";
    return;
  }

  if (profile.id === "coloring") {
    // The sheet is the product, so the readout leads with the paper, the orientation and the
    // 300 DPI pixel size, then says what the settings actually do to the line art.
    const page = scene.page;
    const print = coloringPage(page.id, page.orientation, PRINT_DPI);
    const styleName = scene.style.id === "sketch" ? "pencil sketch" : "clean outlines";
    const ink = scene.inkRatio ? Math.round(scene.inkRatio * 100) : 0;
    sizeLabel.textContent = page.short;
    dimensions.textContent = page.short + " " + page.orientation + " page at " + PRINT_DPI + " DPI ("
      + print.widthPx + " x " + print.heightPx + " px) - " + styleName + " with " + scene.weight.mm
      + " mm lines and " + scene.detail.label.toLowerCase() + " detail"
      + (scene.invert ? ", printed as white lines on black for tracing" : "") + "."
      + " The art keeps a " + round2(page.marginCm) + " cm printer margin on every side"
      + (scene.photo ? ", and about " + ink + "% of the sheet comes back as line" : "")
      + ". No watermark, no sign-up, and your photo never leaves your device.";
    return;
  }

  if (profile.id === "name-tracing") {
    // The sheet is the product, so the readout leads with the paper and the rows the child gets,
    // then pages a whole class list by name.
    const sheet = scene.sheet;
    const paper = scene.paper;
    sizeLabel.textContent = paper.short;
    if (tracePager) tracePager.hidden = scene.pages <= 1;
    if (tracePageLabel) tracePageLabel.textContent = "Sheet " + (scene.page + 1) + " of " + scene.pages;
    const styleName = scene.style.label.toLowerCase();
    const ruleName = scene.rule.label.toLowerCase();
    const pages = scene.pages > 1 ? " One page per name, so this batch holds " + scene.pages + " worksheets." : "";
    const free = sheet.blankRows ? sheet.blankRows + " blank row" + (sheet.blankRows === 1 ? "" : "s") + " for free writing" : "no blank rows";
    const body = paper.short + " worksheet at " + PRINT_DPI + " DPI ("
      + physicalPixels(paper.widthCm, PRINT_DPI) + " x " + physicalPixels(paper.heightCm, PRINT_DPI)
      + " px) - " + sheet.practiceRows + " tracing rows in " + styleName + ", with "
      + ruleName + " and " + free + "."
      + (scene.text
        ? " The name prints across each writing line as many times as it cleanly fits."
        : " Type a name on the left to fill the rows.")
      + pages
      + " Print at 100 percent with no page scaling so the ruled lines come out the size they are on screen."
      + " No watermark, and nothing you type leaves your device.";
    dimensions.textContent = body;
    return;
  }

  if (profile.id === "word-search") {
    // The sheet is the product, so the readout leads with the paper and the finished grid, then
    // says how many of the typed words the generator could actually hide.
    const paper = scene.paper;
    const build = scene.build;
    const gridLabel = build.cells + " x " + build.cells;
    const levelName = build.level.label.split(" - ")[0].toLowerCase();
    const dropped = build.dropped.length;
    sizeLabel.textContent = paper.short;
    if (wsSizeLabel) wsSizeLabel.textContent = L.grid && L.grid.id === "auto" ? "Auto - " + gridLabel : gridLabel;
    dimensions.textContent = paper.short + " " + gridLabel + " word search at " + PRINT_DPI + " DPI ("
      + physicalPixels(paper.widthCm, PRINT_DPI) + " x " + physicalPixels(paper.heightCm, PRINT_DPI)
      + " px), set in " + (scene.caseId === "lower" ? "lowercase" : "uppercase")
      + " on " + levelName + " difficulty with " + (build.placed === 1 ? "1 word" : build.placed + " words") + " hidden"
      + (dropped
        ? ", and " + dropped + " word" + (dropped === 1 ? "" : "s") + " that did not fit on a grid this small"
        : "")
      + (scene.answers
        ? ". The answer key is highlighted under the letters."
        : ". Switch the answer key on to print the highlighted solution.")
      + " Print at 100 percent with no page scaling. No watermark, no sign-up, and nothing you type leaves your device.";
    return;
  }

  if (profile.id === "bingo") {
    // The sheet is the product, so the readout leads with the paper and the run, then says how
    // many entries each card still needs when the typed list is short.
    const paper = scene.paper;
    const sheet = scene.sheet;
    const needed = bingoNeeded(scene.cells, scene.free);
    sizeLabel.textContent = paper.short;
    if (bcSizeLabel) bcSizeLabel.textContent = round2(sheet.cardW) + " x " + round2(sheet.cardH) + " cm cards";
    if (bcPager) bcPager.hidden = scene.pages <= 1;
    if (bcPageLabel) bcPageLabel.textContent = "Sheet " + (scene.page + 1) + " of " + scene.pages;
    if (bcPagePrev) bcPagePrev.disabled = scene.page <= 0;
    if (bcPageNext) bcPageNext.disabled = scene.page >= scene.pages - 1;
    const listNote = scene.modeId === "words"
      ? (scene.words.length >= needed
        ? " Every card is filled from your " + scene.words.length + " entries."
        : " Your " + scene.words.length + " entr" + (scene.words.length === 1 ? "y" : "ies") + " fill part of each card; add "
          + (needed - scene.words.length) + " more to complete it.")
      : " Each card draws its own numbers from the classic B I N G O ranges.";
    dimensions.textContent = paper.short + " sheet at " + PRINT_DPI + " DPI ("
      + physicalPixels(paper.widthCm, PRINT_DPI) + " x " + physicalPixels(paper.heightCm, PRINT_DPI)
      + " px) - " + scene.perSheet + (scene.perSheet === 1 ? " card" : " cards") + " a sheet, "
      + scene.cards.length + (scene.cards.length === 1 ? " card" : " cards") + " in the set on "
      + scene.cardSheets + (scene.cardSheets === 1 ? " sheet" : " sheets")
      + (scene.callListOn ? ", plus a caller's page" : "") + ". "
      + scene.cells + " x " + scene.cells + " cards"
      + (scene.free && scene.cells % 2 === 1 ? " with a free centre square" : "")
      + ", set in " + (scene.caseId === "lower" ? "lowercase" : "uppercase") + "." + listNote
      + " Print at 100 percent with no page scaling. No watermark, no sign-up, and nothing you type leaves your device.";
    return;
  }

  if (profile.id === "multiplication-chart") {
    // The paper and the range are the product, so the readout leads with both of them.
    const paper = scene.paper;
    const sheet = scene.sheet;
    const wroteOut = scene.type === "tables";
    const rangeNote = wroteOut
      ? "the times tables from 1 to " + sheet.max + " written out one block at a time"
      : "a " + sheet.max + " by " + sheet.max + " grid of products";
    const fillNote = scene.fillId === "blank"
      ? (wroteOut ? "every answer left blank to write in" : "a blank grid ready to fill in, with the factors already printed")
      : scene.fillId === "partial"
      ? (wroteOut ? "half the answers printed and the rest left blank" : "the answers above the diagonal printed and the rest left blank")
      : "every answer printed";
    sizeLabel.textContent = paper.short;
    if (mulSizeLabel) mulSizeLabel.textContent = sheet.max + " x " + sheet.max;
    dimensions.textContent = paper.short + " sheet in " + sheet.orient.label.toLowerCase() + " at " + PRINT_DPI + " DPI ("
      + physicalPixels(sheet.widthCm, PRINT_DPI) + " x " + physicalPixels(sheet.heightCm, PRINT_DPI) + " px) - "
      + rangeNote + ", with " + fillNote + " and the square numbers "
      + (scene.squaresId === "on" ? "shaded along the diagonal" : "left plain")
      + ". Print at 100 percent with no page scaling. No watermark, no sign-up, and nothing you type leaves your device.";
    return;
  }

  if (profile.id === "crown-maker") {
    // The band is the product, so the readout leads with the sheet it prints on and the crown it makes.
    const paper = scene.paper;
    const sheet = scene.sheet;
    sizeLabel.textContent = paper.short;
    dimensions.textContent = paper.short + " sheet in landscape at " + PRINT_DPI + " DPI ("
      + physicalPixels(sheet.widthCm, PRINT_DPI) + " x " + physicalPixels(sheet.heightCm, PRINT_DPI) + " px) - "
      + sheet.perSheet + " bands with " + sheet.teeth + " points each, a " + sheet.bandHCm.toFixed(1) + " cm deep "
      + sheet.band.label.toLowerCase() + " in the " + sheet.style.label.toLowerCase() + " style, and a "
      + sheet.tabCm.toFixed(1) + " cm glue tab on the end of every band, so one sheet joins up into about "
      + sheet.fitCm.toFixed(0) + " cm of crown. Print at 100 percent with no page scaling. No watermark, "
      + "no sign-up, and nothing you type leaves your device.";
    return;
  }

  if (profile.id === "chore-chart") {
    // The paper is the product, so the readout leads with the sheet and the week it covers.
    const paper = scene.paper;
    const sheet = scene.sheet;
    const dayCount = scene.days.names.length;
    sizeLabel.textContent = paper.short;
    if (chartSizeLabel) chartSizeLabel.textContent = dayCount + " days x " + sheet.rows + " chores";
    dimensions.textContent = paper.short + " sheet at " + PRINT_DPI + " DPI ("
      + physicalPixels(paper.widthCm, PRINT_DPI) + " x " + physicalPixels(paper.heightCm, PRINT_DPI)
      + " px) - " + sheet.rows + (sheet.rows === 1 ? " chore row" : " chore rows") + " across "
      + dayCount + " day columns (" + scene.days.short + "), with "
      + (scene.chores.length ? scene.chores.length + " job" + (scene.chores.length === 1 ? "" : "s") + " filled in" : "blank chores left ready to write")
      + ". Print at 100 percent with no page scaling. No watermark, no sign-up, and nothing you type leaves your device.";
    return;
  }

  if (profile.id === "place-card") {
    // The sheet is the product, so the readout leads with the paper and then says what is on it.
    const grid = scene.grid;
    if (placeCardPager) placeCardPager.hidden = !scene.guests.length;
    if (placeCardPageLabel) placeCardPageLabel.textContent = "Sheet " + (scene.page + 1) + " of " + scene.pages;
    if (placeCardPagePrev) placeCardPagePrev.disabled = scene.page <= 0;
    if (placeCardPageNext) placeCardPageNext.disabled = scene.page >= scene.pages - 1;
    const filled = Math.min(grid.perSheet, Math.max(0, scene.guests.length - scene.page * grid.perSheet));
    dimensions.textContent = scene.spec.short + " sheet of " + (grid.style === "tent" ? "folded tent" : "flat")
      + " place cards at " + PRINT_DPI + " DPI (" + physicalPixels(scene.spec.widthCm, PRINT_DPI) + " x "
      + physicalPixels(scene.spec.heightCm, PRINT_DPI) + " px) - " + grid.perSheet + " cards a sheet, "
      + filled + " filled on this one" + (scene.pages > 1 ? " of " + scene.pages + " sheets" : "") + "."
      + " The download is a print-ready PNG of the whole sheet, light cut lines and all."
      + (scene.guests.length ? "" : " Type a guest list on the left to fill the first card.")
      + " No watermark, and nothing you type leaves your device.";
    return;
  }
  if (profile.id === "cupcake") {
    // A topper is a round print, so the readout leads with the diameter and the batch count.
    const topper = scene.topper;
    const inches = (cm) => round2(cm / 2.54);
    const shapeName = { circle: "round", scallop: "scalloped", rounded: "rounded corner", square: "square" }[scene.shape] || "round";
    sizeLabel.textContent = topper.short;
    if (scene.sheet) {
      const grid = scene.grid;
      dimensions.textContent = topper.short + " " + shapeName + " toppers tiled " + grid.cols + " across and "
        + grid.rows + " down on " + (scene.sheet.short === "A4" ? "an " : "a ") + scene.sheet.short + " sheet at "
        + PRINT_DPI + " DPI (" + physicalPixels(scene.sheet.widthCm, PRINT_DPI) + " x "
        + physicalPixels(scene.sheet.heightCm, PRINT_DPI) + " px) - " + grid.perSheet
        + " toppers a sheet, with light cut lines you can trim along."
        + (scene.image ? " Your photo is cover-fitted into every disc." : " Upload a photo to fill the discs.")
        + (scene.text ? " The message prints on a band across the foot of each one." : "")
        + " No watermark, and your photo never leaves your device.";
      return;
    }
    dimensions.textContent = topper.short + " " + shapeName + " topper at " + PRINT_DPI + " DPI ("
      + physicalPixels(topper.widthCm, PRINT_DPI) + " x " + physicalPixels(topper.heightCm, PRINT_DPI)
      + " px, " + inches(topper.widthCm) + " x " + inches(topper.heightCm)
      + " in) - a print-ready PNG of the whole topper, card and cut line included."
      + (scene.image ? " Your photo is cover-fitted into the disc." : " Upload a photo to fill the disc, or print the blank card as a template.")
      + (scene.text ? " The message prints on a band across the foot." : "")
      + " No watermark, and your photo never leaves your device.";
    return;
  }
  if (profile.id === "gift-tag") {
    // A tag is a small print, so the readout leads with the footprint and the batch count.
    const tag = scene.tag;
    const inches = (cm) => round2(cm / 2.54);
    const shapeName = { tag: "classic", rounded: "rounded corner", scallop: "scalloped", square: "square" }[scene.shape] || "classic";
    const extras = [];
    if (scene.text) extras.push("the message");
    if (scene.to || scene.from) extras.push("the To and From lines");
    // The extras are mid-sentence fragments, so the sentence is assembled here and keeps its
    // capital letter and its verb agreement no matter which lines the tag actually carries.
    const extrasLine = extras.length
      ? " " + extras.join(" and ").replace(/^./, (ch) => ch.toUpperCase()) + (extras.length > 1 ? " print" : " prints") + " on the card."
      : "";
    sizeLabel.textContent = tag.short;
    if (scene.sheet) {
      const grid = scene.grid;
      dimensions.textContent = tag.short + " " + shapeName + " gift tags tiled " + grid.cols + " across and "
        + grid.rows + " down on " + (scene.sheet.short === "A4" ? "an " : "a ") + scene.sheet.short + " sheet at "
        + PRINT_DPI + " DPI (" + physicalPixels(scene.sheet.widthCm, PRINT_DPI) + " x "
        + physicalPixels(scene.sheet.heightCm, PRINT_DPI) + " px) - " + grid.perSheet
        + " tags a sheet, each with a punch guide where the eyelet goes and light cut lines to trim along."
        + (scene.image ? " Your photo is cover-fitted into every tag." : " Upload a photo to fill the tags, or print blank cards to write on.")
        + extrasLine
        + " No watermark, and your photo never leaves your device.";
      return;
    }
    dimensions.textContent = tag.short + " " + shapeName + " gift tag at " + PRINT_DPI + " DPI ("
      + physicalPixels(tag.widthCm, PRINT_DPI) + " x " + physicalPixels(tag.heightCm, PRINT_DPI)
      + " px, " + inches(tag.widthCm) + " x " + inches(tag.heightCm)
      + " in) - a print-ready PNG with the punch guide and the cut line on it."
      + (scene.image ? " Your photo is cover-fitted into the tag." : " Upload a photo to fill the tag, or print the blank card to write on.")
      + extrasLine
      + " No watermark, and your photo never leaves your device.";
    return;
  }
  if (profile.id === "polaroid") {
    // The film is the product, so the readout leads with the frame and then says whether the
    // download is one frame or a whole sheet of them.
    const frame = scene.frame;
    const inches = (cm) => round2(cm / 2.54);
    const finishNote = scene.finish && scene.finish.id !== "original" ? " with a " + scene.finish.label.toLowerCase() + " over it" : "";
    if (scene.sheet) {
      const grid = scene.grid;
      dimensions.textContent = frame.short + " frames tiled " + grid.cols + " across and " + grid.rows
        + " down on " + (scene.sheet.short === "A4" ? "an " : "a ") + scene.sheet.short + " sheet at " + PRINT_DPI + " DPI ("
        + physicalPixels(scene.sheet.widthCm, PRINT_DPI) + " x " + physicalPixels(scene.sheet.heightCm, PRINT_DPI)
        + " px) - " + grid.perSheet + " frames a sheet with light trim lines."
        + (scene.image ? " Your photo is cover-fitted into every frame" + finishNote + "." : " Upload a photo to fill the frames.")
        + (scene.caption ? " The caption prints in the bottom border of each one." : "")
        + " No watermark, and your photo never leaves your device.";
      return;
    }
    dimensions.textContent = frame.short + " frame at " + PRINT_DPI + " DPI (" + physicalPixels(frame.widthCm, PRINT_DPI)
      + " x " + physicalPixels(frame.heightCm, PRINT_DPI) + " px, " + inches(frame.widthCm) + " x " + inches(frame.heightCm)
      + " in) - a print-ready PNG of the whole film frame, border and all."
      + (scene.image ? " Your photo is cover-fitted into the window" + finishNote + "." : " Upload a photo to fill the window, or download the blank frame as a template.")
      + (scene.caption ? " The caption prints in the bottom border." : "")
      + " No watermark, and your photo never leaves your device.";
    return;
  }
  if (profile.id === "jigsaw") {
    // The puzzle is the only tool whose readout is about the piece count as much as the size.
    const grid = scene.grid;
    dimensions.textContent = scene.longSideCm + " cm long side, " + grid.pieces + " pieces (" + grid.cols + " x " + grid.rows
      + ") at " + PRINT_DPI + " DPI (" + physicalPixels(scene.longSideCm, PRINT_DPI) + " px long side) - the PNG is ready to print and already shows the cut lines;"
      + " the SVG is a separate cut file with the outline and every interior cut. Ask us for a quote when you want it made in acrylic.";
    return;
  }

  if (profile.id === "sticker-outline") {
    // The keyline is the product here, so the readout leads with the border that was chosen.
    const preset = STICKER_BORDER_PRESETS.find((entry) => entry.hex === scene.border);
    const named = preset ? preset.label : scene.border;
    const box = pieceBox();
    const cmPerWorkPx = (exportScale() * 2.54) / PRINT_DPI;
    dimensions.textContent = round2(box.width * cmPerWorkPx) + " x " + round2(box.height * cmPerWorkPx)
      + " cm sticker at " + PRINT_DPI + " DPI (" + physicalPixels(scene.longSideCm, PRINT_DPI) + " px long side) - a "
      + scene.borderMm + " mm " + named + " border around your artwork, on a transparent background, so it prints clean"
      + " and drops straight into Canva, Procreate or a print queue."
      + (backgroundLifted ? " The flat background behind your picture was removed first, so the border hugs the subject." : "");
    return;
  }

  const piece = pieceBox();
  const cmPerWorkPx = (exportScale() * 2.54) / PRINT_DPI;
  const exportLong = physicalPixels(L.longSideCm, PRINT_DPI);
  const suffix = profile.id === "sticker"
    ? "the download is the cut shape, offset included"
    : profile.id === "ornament"
      ? "transparent PNG at 300 DPI plus an SVG cut path; the hanging loop is a preview only"
    : profile.id === "luggage-tag"
      ? "transparent PNG at 300 DPI plus an SVG cut path with the strap hole; the strap is a preview only"
    : profile.id === "pet-tag"
      ? "transparent PNG at 300 DPI plus an SVG cut path with the collar hole; the loop is a preview only"
      : profile.id === "bookmark"
        ? "transparent PNG at 300 DPI plus an SVG cut path with the tassel hole; the tassel is a preview only"
      : profile.id === "coaster"
        ? "transparent PNG at 300 DPI plus an SVG cut path; the coaster rim in the preview is decoration only"
      : profile.id === "photo-keychain"
      ? "transparent PNG at 300 DPI; the keyring is a preview only"
      : profile.id === "name-keychain"
        ? "transparent PNG at 300 DPI; the hanging hole and ring are preview only"
      : profile.id === "cake-topper"
        ? "transparent PNG at 300 DPI plus an SVG cut path; the cake stick in the preview is decoration only"
        : "transparent PNG, no watermark";
  const lifted = backgroundLifted && profile.id === "sticker"
    ? " The flat background behind your picture was removed, so the cut line follows the subject."
    : "";
  dimensions.textContent = `${round2(piece.width * cmPerWorkPx)} x ${round2(piece.height * cmPerWorkPx)} cm finished piece at ${PRINT_DPI} DPI (${exportLong} px long side) - ${suffix}.${lifted}`;
}

function note(text) {
  dimensions.textContent = text;
}

// ------------------------------------------------------------------ painters

/**
 * A photo jigsaw board. The picture is cover-fitted into the board and the cut lines are
 * painted on top, because for this product the cut lines are the thing the visitor came for:
 * they have to be in the printed PNG as well as in the preview. The preview adds a drop
 * shadow and a sheen so the board reads as a real object; neither is in the export.
 */
function drawJigsaw(c, s, guides) {
  const r = s.rect;
  if (guides) {
    c.save();
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = 26;
    c.shadowOffsetY = 12;
    c.fillStyle = "#ffffff";
    c.fillRect(r.x, r.y, r.w, r.h);
    c.restore();
  }
  c.save();
  c.beginPath();
  c.rect(r.x, r.y, r.w, r.h);
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  drawCover(c, s.image, r.x, r.y, r.w, r.h);
  if (guides) {
    const sheen = c.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
    sheen.addColorStop(0, "rgba(255,255,255,.18)");
    sheen.addColorStop(0.45, "rgba(255,255,255,0)");
    sheen.addColorStop(1, "rgba(29,36,32,.10)");
    c.fillStyle = sheen;
    c.fillRect(r.x, r.y, r.w, r.h);
  }
  c.restore();
  c.save();
  c.lineJoin = "round";
  c.lineCap = "round";
  c.strokeStyle = "rgba(29,36,32,.60)";
  c.lineWidth = 2.2;
  c.beginPath();
  c.moveTo(s.outline[0][0], s.outline[0][1]);
  for (let i = 1; i < s.outline.length; i++) c.lineTo(s.outline[i][0], s.outline[i][1]);
  c.closePath();
  for (const cut of s.cuts) {
    c.moveTo(cut[0][0], cut[0][1]);
    for (let i = 1; i < cut.length; i++) c.lineTo(cut[i][0], cut[i][1]);
  }
  c.stroke();
  c.restore();
}

function drawSticker(c, s, guides) {
  if (!s.outline.length) return;
  c.save();
  c.fillStyle = "#ffffff";
  c.beginPath();
  for (const pts of s.outline) addPolygon(c, pts);
  c.fill("evenodd");
  c.restore();
  c.drawImage(s.image, s.rect.x, s.rect.y, s.rect.w, s.rect.h);
  if (guides) {
    c.save();
    c.setLineDash([7, 6]);
    c.lineWidth = 1.6;
    c.strokeStyle = "rgba(239,105,76,.9)";
    c.beginPath();
    for (const pts of s.base) addPolygon(c, pts);
    c.stroke();
    c.restore();
  }
}

/**
 * The sticker a visitor actually prints. Same traced silhouette as the cutline tool, but the
 * fill is the border colour they chose, and the preview adds a soft drop shadow so a
 * transparent-background sticker still reads as an object sitting on the page. The shadow is
 * preview-only: the exported PNG keeps clean edges and its transparency.
 */
function drawStickerOutline(c, s, guides) {
  if (!s.outline.length) return;
  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.28)";
    c.shadowBlur = 24;
    c.shadowOffsetY = 11;
  }
  c.fillStyle = s.border;
  c.beginPath();
  for (const pts of s.outline) addPolygon(c, pts);
  c.fill("evenodd");
  c.restore();
  c.drawImage(s.image, s.rect.x, s.rect.y, s.rect.w, s.rect.h);
  if (guides) {
    c.save();
    c.setLineDash([7, 6]);
    c.lineWidth = 1.6;
    c.strokeStyle = "rgba(239,105,76,.55)";
    c.beginPath();
    for (const pts of s.base) addPolygon(c, pts);
    c.stroke();
    c.restore();
  }
}

function clearStripPhotos() {
  stripPhotos = [];
  if (upload) upload.value = "";
  setDownloadsEnabled(false);
  adoptSource("upload");
  render();
}

/** Drops the optional photo but keeps the finished card, which stands on its own. */
function clearTableNumberPhoto() {
  tablePhoto = null;
  if (upload) upload.value = "";
  adoptSource("upload");
  render();
}

/** The card silhouette as a path: an arch, a soft-cornered card, or a plain rectangle. */
function tableNumberPath(c, r, shape) {
  c.beginPath();
  if (shape === "arch") {
    // A full semicircle on top, so the card reads as the arch sign people search for.
    const radius = r.w / 2;
    c.moveTo(r.x, r.y + r.h);
    c.lineTo(r.x, r.y + radius);
    c.quadraticCurveTo(r.x, r.y, r.x + radius, r.y);
    c.quadraticCurveTo(r.x + r.w, r.y, r.x + r.w, r.y + radius);
    c.lineTo(r.x + r.w, r.y + r.h);
    c.closePath();
    return;
  }
  const radius = shape === "rounded" ? Math.min(r.w, r.h) * 0.1 : Math.min(r.w, r.h) * 0.012;
  if (typeof c.roundRect === "function") c.roundRect(r.x, r.y, r.w, r.h, radius);
  else c.rect(r.x, r.y, r.w, r.h);
}

/**
 * A wedding table number. The card stock, the silhouette and the two lines of type all follow
 * the chosen size, so the same painter draws every combination. With a photo the picture runs
 * edge to edge and the number sits on a band of card stock; without one the number is centred on
 * plain stock. The preview adds a drop shadow; the export never does.
 */
function drawTableNumber(c, s, guides) {
  const r = s.rect;
  const ink = readableInk(s.paper);
  const family = s.font || DEFAULT_TABLE_NUMBER_FONT;
  const pad = Math.min(r.w, r.h) * 0.09;
  const number = (s.number || "").trim();
  const names = (s.names || "").trim();

  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = 28;
    c.shadowOffsetY = 12;
  }
  tableNumberPath(c, r, s.shape);
  c.fillStyle = s.paper;
  c.fill();
  c.restore();

  c.save();
  tableNumberPath(c, r, s.shape);
  c.clip();

  if (s.photo) {
    drawCover(c, s.photo, r.x, r.y, r.w, r.h);
    // A solid band of card stock at the foot is what keeps the number readable over any photo.
    const bandH = Math.round(r.h * (names ? 0.34 : 0.26));
    const bandY = r.y + r.h - bandH;
    c.fillStyle = s.paper;
    c.fillRect(r.x, bandY, r.w, bandH);
    c.save();
    c.strokeStyle = "rgba(29,36,32,.14)";
    c.lineWidth = Math.max(1, r.w * 0.003);
    c.beginPath();
    c.moveTo(r.x, bandY);
    c.lineTo(r.x + r.w, bandY);
    c.stroke();
    c.restore();
    c.save();
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    const wanted = bandH * (names ? 0.62 : 0.7);
    const numberSize = Math.min(bandH * (names ? 0.62 : 0.72), fitFont(c, number, r.w * 0.68, wanted, family, 700));
    c.font = "700 " + numberSize + "px " + family;
    c.fillText(number, r.x + r.w / 2, bandY + (names ? bandH * 0.36 : bandH * 0.5), r.w * 0.8);
    if (names) {
      const nameSize = fitFont(c, names, r.w * 0.76, bandH * 0.2, family, 600);
      c.font = "600 " + nameSize + "px " + family;
      c.fillText(names, r.x + r.w / 2, bandY + bandH * 0.74, r.w * 0.8);
    }
    c.restore();
  } else {
    // Plain stock: the arch pushes the number down so it never rides into the curved shoulder.
    const top = s.shape === "arch" ? r.y + r.w * 0.42 : r.y + pad;
    const bottom = r.y + r.h - pad;
    const namesH = names ? Math.min((bottom - top) * 0.2, r.w * 0.16) : 0;
    const numberBottom = bottom - namesH;
    const numberSize = fitFont(c, number, r.w - pad * 2, (numberBottom - top) * 0.82, family, 700);
    c.save();
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "700 " + numberSize + "px " + family;
    c.fillText(number, r.x + r.w / 2, (top + numberBottom) / 2, r.w - pad * 2);
    if (names) {
      const ruleY = bottom - namesH * 0.72;
      const ruleW = Math.min(r.w * 0.22, (r.w - pad * 2) * 0.4);
      c.globalAlpha = 0.5;
      c.strokeStyle = ink;
      c.lineWidth = Math.max(1, r.w * 0.006);
      c.beginPath();
      c.moveTo(r.x + r.w / 2 - ruleW / 2, ruleY);
      c.lineTo(r.x + r.w / 2 + ruleW / 2, ruleY);
      c.stroke();
      c.globalAlpha = 1;
      const nameSize = fitFont(c, names, r.w - pad * 2, namesH * 0.8, family, 600);
      c.font = "600 " + nameSize + "px " + family;
      c.fillText(names, r.x + r.w / 2, bottom - namesH * 0.28, r.w - pad * 2);
    }
    c.restore();
  }
  c.restore();
}

/**
 * A printable sheet of place cards. The sheet size sets the paper, the card style decides how
 * many cards fit and whether each one folds, and the guest list fills them in the order it was
 * typed. The preview adds a drop shadow; the export never does.
 */
function drawPlaceCardSheet(c, s, guides) {
  const r = s.rect;
  const grid = s.grid;
  const pxPerCm = r.w / grid.sheet.widthCm;
  const margin = grid.marginCm * pxPerCm;
  const cardW = grid.card.widthCm * pxPerCm;
  const cardH = grid.card.heightCm * pxPerCm;
  const ink = readableInk(s.paper);
  const family = s.font || DEFAULT_PLACE_CARD_FONT;
  const hair = ink === "#ffffff" ? "rgba(255,255,255,.24)" : "rgba(29,36,32,.16)";
  const fold = ink === "#ffffff" ? "rgba(255,255,255,.38)" : "rgba(29,36,32,.3)";

  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = 28;
    c.shadowOffsetY = 12;
  }
  c.fillStyle = s.paper;
  c.fillRect(r.x, r.y, r.w, r.h);
  c.restore();

  // Cut lines. Every card shares an edge with its neighbour, so one trimmer pass down each line
  // separates the whole sheet.
  c.save();
  c.strokeStyle = hair;
  c.lineWidth = Math.max(1, r.w * 0.0016);
  for (let col = 0; col <= grid.cols; col += 1) {
    const x = r.x + margin + col * cardW;
    c.beginPath();
    c.moveTo(x, r.y + margin);
    c.lineTo(x, r.y + margin + grid.rows * cardH);
    c.stroke();
  }
  for (let row = 0; row <= grid.rows; row += 1) {
    const y = r.y + margin + row * cardH;
    c.beginPath();
    c.moveTo(r.x + margin, y);
    c.lineTo(r.x + margin + grid.cols * cardW, y);
    c.stroke();
  }
  c.restore();

  const start = s.page * grid.perSheet;
  let printed = 0;
  for (let row = 0; row < grid.rows; row += 1) {
    for (let col = 0; col < grid.cols; col += 1) {
      const guest = s.guests[start + row * grid.cols + col];
      if (!guest) continue;
      printed += 1;
      const x = r.x + margin + col * cardW;
      const y = r.y + margin + row * cardH;
      if (grid.style === "tent") {
        // A tent card prints both halves of the fold, the lower one turned a half turn, so the
        // name reads the right way up from either side of the table once it is folded.
        const halfH = cardH / 2;
        drawPlaceCardFace(c, x + cardW / 2, y + halfH / 2, cardW, halfH, guest, family, ink, false);
        drawPlaceCardFace(c, x + cardW / 2, y + halfH * 1.5, cardW, halfH, guest, family, ink, true);
        c.save();
        c.strokeStyle = fold;
        c.lineWidth = Math.max(1, cardW * 0.006);
        c.setLineDash([cardW * 0.05, cardW * 0.04]);
        c.beginPath();
        c.moveTo(x + cardW * 0.07, y + halfH);
        c.lineTo(x + cardW * 0.93, y + halfH);
        c.stroke();
        c.restore();
      } else {
        drawPlaceCardFace(c, x + cardW / 2, y + cardH / 2, cardW, cardH, guest, family, ink, false);
      }
    }
  }

  if (!printed) {
    // An empty sheet still shows the stock and the cut lines, so the first thing a visitor sees
    // is the paper they picked rather than a blank canvas.
    const head = s.guests.length
      ? "Every card on this sheet is full"
      : "Type a guest name to fill the first card";
    c.save();
    c.fillStyle = ink;
    c.globalAlpha = 0.42;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "600 " + Math.max(11, Math.min(r.w, r.h) * 0.032) + "px " + family;
    c.fillText(head, r.x + r.w / 2, r.y + r.h / 2);
    c.restore();
  }
}

/** One side of a place card: the guest's name, with the meal mark underneath when asked for. */
function drawPlaceCardFace(c, cx, cy, w, h, guest, family, ink, rotated) {
  const name = guest && guest.name ? guest.name.trim() : "";
  if (!name) return;
  const meal = guest.meal || "";
  const inner = w * 0.86;
  c.save();
  c.translate(cx, cy);
  if (rotated) c.rotate(Math.PI);
  c.fillStyle = ink;
  c.textAlign = "center";
  c.textBaseline = "middle";
  const size = fitFont(c, name, inner, h * (meal ? 0.44 : 0.54), family, 600);
  c.font = "600 " + size + "px " + family;
  c.fillText(name, 0, meal ? -h * 0.12 : 0, inner);
  if (meal) drawMealGlyph(c, meal, 0, h * 0.26, Math.min(w * 0.13, h * 0.22), ink);
  c.restore();
}

/**
 * The line-art meal mark printed under a guest's name. Five simple drawings cover the choices
 * couples actually offer, and they stay legible at the size a 3.5 in card can carry.
 */
function drawMealGlyph(c, meal, cx, cy, size, ink) {
  const radius = size / 2;
  const u = size * 0.62;
  c.save();
  c.translate(cx, cy);
  c.strokeStyle = ink;
  c.lineWidth = Math.max(1, size * 0.09);
  c.lineCap = "round";
  c.lineJoin = "round";
  c.globalAlpha = 0.34;
  c.beginPath();
  c.arc(0, 0, radius, 0, Math.PI * 2);
  c.stroke();
  c.globalAlpha = 1;
  if (meal === "beef") {
    roundRect(c, -u * 0.5, -u * 0.28, u, u * 0.56, u * 0.2);
    c.stroke();
    c.beginPath();
    c.moveTo(-u * 0.18, 0);
    c.quadraticCurveTo(0, -u * 0.15, u * 0.18, 0);
    c.stroke();
  } else if (meal === "chicken") {
    // A drumstick, not a magnifier: the meat sits up and to the left, the bone points away.
    c.beginPath();
    c.arc(-u * 0.24, -u * 0.22, u * 0.34, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(u * 0.02, u * 0.04);
    c.lineTo(u * 0.38, u * 0.36);
    c.stroke();
    c.beginPath();
    c.moveTo(u * 0.38, u * 0.36);
    c.lineTo(u * 0.54, u * 0.24);
    c.moveTo(u * 0.38, u * 0.36);
    c.lineTo(u * 0.5, u * 0.5);
    c.stroke();
  } else if (meal === "fish") {
    c.beginPath();
    c.moveTo(-u * 0.5, 0);
    c.quadraticCurveTo(-u * 0.05, -u * 0.46, u * 0.28, 0);
    c.quadraticCurveTo(-u * 0.05, u * 0.46, -u * 0.5, 0);
    c.stroke();
    c.beginPath();
    c.moveTo(u * 0.24, 0);
    c.lineTo(u * 0.52, -u * 0.26);
    c.lineTo(u * 0.52, u * 0.26);
    c.closePath();
    c.stroke();
  } else if (meal === "veg") {
    c.beginPath();
    c.moveTo(0, -u * 0.48);
    c.quadraticCurveTo(u * 0.5, -u * 0.08, 0, u * 0.48);
    c.quadraticCurveTo(-u * 0.5, -u * 0.08, 0, -u * 0.48);
    c.stroke();
    c.beginPath();
    c.moveTo(0, -u * 0.4);
    c.lineTo(0, u * 0.4);
    c.stroke();
  } else {
    // Anything else the list asks for, kids included, gets the star a venue would print.
    c.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const step = i % 2 ? u * 0.2 : u * 0.5;
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const px = Math.cos(angle) * step;
      const py = Math.sin(angle) * step;
      if (i) c.lineTo(px, py); else c.moveTo(px, py);
    }
    c.closePath();
    c.stroke();
  }
  c.restore();
}
/**
 * An instant-film frame. The film footprint and the photo window are fixed, so the photo is
 * cover-fitted into a window instead of setting the shape of the piece the way an upload does.
 * A single frame and a whole tiled sheet share the same card painter, so the preview and the
 * download can never disagree about where the border falls.
 */
function drawPolaroid(c, s, guides) {
  const r = s.rect;
  if (s.sheet) {
    // A print sheet of frames: the paper is blank stock and the frames are seated in a grid with
    // a small gutter, so a trimmer pass down each gutter separates the whole run.
    const grid = s.grid;
    const pxPerCm = r.w / grid.sheet.widthCm;
    const frameW = grid.frame.widthCm * pxPerCm;
    const frameH = grid.frame.heightCm * pxPerCm;
    const gutter = grid.gutterCm * pxPerCm;
    const blockW = grid.cols * frameW + (grid.cols - 1) * gutter;
    const blockH = grid.rows * frameH + (grid.rows - 1) * gutter;
    const originX = r.x + (r.w - blockW) / 2;
    const originY = r.y + (r.h - blockH) / 2;
    c.save();
    if (guides) {
      c.shadowColor = "rgba(29,36,32,.22)";
      c.shadowBlur = 28;
      c.shadowOffsetY = 12;
    }
    c.fillStyle = "#ffffff";
    c.fillRect(r.x, r.y, r.w, r.h);
    c.restore();
    c.save();
    c.strokeStyle = "rgba(29,36,32,.16)";
    c.lineWidth = Math.max(1, r.w * 0.0016);
    c.setLineDash([Math.max(2, gutter * 0.34), Math.max(2, gutter * 0.3)]);
    for (let col = 1; col < grid.cols; col += 1) {
      const x = originX + col * frameW + (col - 0.5) * gutter;
      c.beginPath();
      c.moveTo(x, originY - gutter * 0.45);
      c.lineTo(x, originY + blockH + gutter * 0.45);
      c.stroke();
    }
    for (let row = 1; row < grid.rows; row += 1) {
      const y = originY + row * frameH + (row - 0.5) * gutter;
      c.beginPath();
      c.moveTo(originX - gutter * 0.45, y);
      c.lineTo(originX + blockW + gutter * 0.45, y);
      c.stroke();
    }
    c.restore();
    for (let row = 0; row < grid.rows; row += 1) {
      for (let col = 0; col < grid.cols; col += 1) {
        const x = originX + col * (frameW + gutter);
        const y = originY + row * (frameH + gutter);
        drawPolaroidCard(c, x, y, frameW, frameH, s, guides);
      }
    }
    return;
  }
  drawPolaroidCard(c, r.x, r.y, r.w, r.h, s, guides);
}

/** One instant photo: the film border, the window, the graded photo and the caption. */
function drawPolaroidCard(c, x, y, w, h, s, guides) {
  const frame = s.frame;
  const ink = readableInk(s.paper);
  const pxPerCm = w / frame.widthCm;
  const radius = Math.max(2, Math.min(w, h) * 0.02);
  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.26)";
    c.shadowBlur = Math.max(6, w * 0.03);
    c.shadowOffsetY = Math.max(2, h * 0.012);
  }
  c.fillStyle = s.paper;
  roundRect(c, x, y, w, h, radius);
  c.fill();
  c.restore();

  const win = frame.window;
  const wx = x + win.x * pxPerCm;
  const wy = y + win.y * pxPerCm;
  const ww = win.w * pxPerCm;
  const wh = win.h * pxPerCm;

  c.save();
  roundRect(c, wx, wy, ww, wh, Math.max(1, radius * 0.5));
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(wx, wy, ww, wh);
  if (s.image) {
    drawCover(c, s.image, wx, wy, ww, wh);
    drawPolaroidFinish(c, s.finish, wx, wy, ww, wh);
  } else {
    // The blank frame is a real download, so the empty window has to look deliberate.
    c.fillStyle = "rgba(29,36,32,.32)";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "600 " + Math.max(9, ww * 0.08) + "px " + (s.font || DEFAULT_POLAROID_FONT);
    c.fillText("Add your photo", wx + ww / 2, wy + wh / 2);
  }
  c.restore();

  // A hairline keeps the window reading as film, even against a white sheet.
  c.save();
  c.strokeStyle = "rgba(29,36,32,.2)";
  c.lineWidth = Math.max(1, w * 0.004);
  roundRect(c, wx, wy, ww, wh, Math.max(1, radius * 0.5));
  c.stroke();
  c.restore();

  const caption = (s.caption || "").trim();
  const bandTop = wy + wh;
  const bandH = y + h - bandTop;
  if (caption && bandH > 4) {
    c.save();
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    const family = s.font || DEFAULT_POLAROID_FONT;
    const size = fitFont(c, caption, ww, Math.min(bandH * 0.6, ww * 0.26), family, 600);
    c.font = "600 " + size + "px " + family;
    c.fillText(caption, x + w / 2, bandTop + bandH * 0.52, ww);
    c.restore();
  }
}

/** The one blend that gives a photo its instant-film look. */
function drawPolaroidFinish(c, finish, x, y, w, h) {
  if (!finish || !finish.op || !(finish.alpha > 0)) return;
  c.save();
  c.globalCompositeOperation = finish.op;
  c.globalAlpha = finish.alpha;
  c.fillStyle = finish.hex;
  c.fillRect(x, y, w, h);
  c.restore();
}

/**
 * A printed cupcake topper. The disc is cut from card stock, so the silhouette decides the
 * shape, the card colour shows around the photo, and the message sits on a band at the foot.
 * A single topper and a whole tiled sheet share the same disc painter, so the preview and the
 * download can never disagree about where the cut line falls.
 */
function drawCupcake(c, s, guides) {
  const r = s.rect;
  if (s.sheet) {
    // A print sheet of toppers: the paper is blank stock and the discs are seated in a grid with
    // a small gutter, so a trimmer pass down each gutter separates the whole run.
    const grid = s.grid;
    const pxPerCm = r.w / grid.sheet.widthCm;
    const disc = grid.topper.widthCm * pxPerCm;
    const gutter = grid.gutterCm * pxPerCm;
    const blockW = grid.cols * disc + (grid.cols - 1) * gutter;
    const blockH = grid.rows * disc + (grid.rows - 1) * gutter;
    const originX = r.x + (r.w - blockW) / 2;
    const originY = r.y + (r.h - blockH) / 2;
    c.save();
    if (guides) {
      c.shadowColor = "rgba(29,36,32,.22)";
      c.shadowBlur = 28;
      c.shadowOffsetY = 12;
    }
    c.fillStyle = "#ffffff";
    c.fillRect(r.x, r.y, r.w, r.h);
    c.restore();
    c.save();
    c.strokeStyle = "rgba(29,36,32,.18)";
    c.lineWidth = Math.max(1, r.w * 0.0016);
    c.setLineDash([Math.max(2, gutter * 0.34), Math.max(2, gutter * 0.3)]);
    for (let col = 1; col < grid.cols; col += 1) {
      const x = originX + col * disc + (col - 0.5) * gutter;
      c.beginPath();
      c.moveTo(x, originY - gutter * 0.5);
      c.lineTo(x, originY + blockH + gutter * 0.5);
      c.stroke();
    }
    for (let row = 1; row < grid.rows; row += 1) {
      const y = originY + row * disc + (row - 0.5) * gutter;
      c.beginPath();
      c.moveTo(originX - gutter * 0.5, y);
      c.lineTo(originX + blockW + gutter * 0.5, y);
      c.stroke();
    }
    c.restore();
    for (let row = 0; row < grid.rows; row += 1) {
      for (let col = 0; col < grid.cols; col += 1) {
        const x = originX + col * (disc + gutter);
        const y = originY + row * (disc + gutter);
        drawCupcakeTopper(c, x, y, disc, disc, s, guides);
      }
    }
    return;
  }
  drawCupcakeTopper(c, r.x, r.y, r.w, r.h, s, guides);
}

/** One topper: the card silhouette, the photo inside it, the message band and the cut line. */
function drawCupcakeTopper(c, x, y, w, h, s, guides) {
  const ink = readableInk(s.paper);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const family = s.font || DEFAULT_CUPCAKE_FONT;
  const pad = Math.min(w, h) * 0.035;
  const inner = Math.min(w, h) - pad * 2;
  const round = s.shape === "circle" || s.shape === "scallop";
  const message = (s.text || "").trim();
  // A round card narrows as it falls away from its waist, so the message band sitting at the
  // foot can only be as wide as the card is there. The type is sized against that chord, which
  // keeps every glyph on the card instead of running past the cut line.
  const radius = inner * (s.shape === "scallop" ? 0.475 : 0.5);
  const bandH = message ? inner * (round ? 0.3 : 0.34) : 0;
  const bandTop = y + pad + inner - bandH;
  const bandMid = bandTop + bandH * 0.54;
  const chordHalf = (dy) => (round
    ? Math.sqrt(Math.max(0, radius * radius - Math.min(Math.abs(dy), radius) * Math.min(Math.abs(dy), radius)))
    : inner / 2);
  const messageW = (size) => chordHalf(Math.abs(bandMid - cy) + size * 0.42) * 1.7;

  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.26)";
    c.shadowBlur = Math.max(6, w * 0.03);
    c.shadowOffsetY = Math.max(2, h * 0.012);
  }
  cupcakeShapePath(c, s.shape, x + pad, y + pad, inner, inner);
  c.fillStyle = s.paper;
  c.fill();
  c.restore();

  c.save();
  cupcakeShapePath(c, s.shape, x + pad, y + pad, inner, inner);
  c.clip();
  if (s.image) {
    drawCover(c, s.image, x + pad, y + pad, inner, inner);
  } else {
    c.fillStyle = "rgba(29,36,32,.05)";
    c.fillRect(x, y, w, h);
    c.fillStyle = "rgba(29,36,32,.34)";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "600 " + Math.max(9, inner * 0.075) + "px " + family;
    c.fillText("Add your photo", cx, cy - inner * 0.12);
  }
  if (message) {
    // The band is the card showing through, so the message stays readable over any photo.
    c.save();
    c.fillStyle = s.paper;
    c.globalAlpha = 0.9;
    c.fillRect(x + pad - 1, bandTop, inner + 2, bandH + 1);
    c.restore();
    c.save();
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    let size = Math.min(bandH * 0.62, inner * 0.26);
    for (; size > 8; size -= 1) {
      c.font = "600 " + size + "px " + family;
      if (c.measureText(message).width <= messageW(size)) break;
    }
    c.font = "600 " + size + "px " + family;
    c.fillText(message, cx, bandMid, messageW(size));
    c.restore();
  }
  c.restore();

  // A hairline keeps the silhouette reading as card stock; the dashed ring is the cut line.
  c.save();
  c.strokeStyle = "rgba(29,36,32,.16)";
  c.lineWidth = Math.max(0.8, inner * 0.004);
  cupcakeShapePath(c, s.shape, x + pad, y + pad, inner, inner);
  c.stroke();
  c.setLineDash([Math.max(2, inner * 0.055), Math.max(2, inner * 0.04)]);
  c.strokeStyle = "rgba(29,36,32,.34)";
  c.lineWidth = Math.max(0.9, inner * 0.005);
  cupcakeShapePath(c, s.shape, x + pad * 0.5, y + pad * 0.5, inner + pad, inner + pad);
  c.stroke();
  c.restore();
}

/** Builds one of the four topper silhouettes inside the given square box. */
function cupcakeShapePath(c, shape, x, y, w, h) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  if (shape === "square") {
    c.beginPath();
    c.rect(x, y, w, h);
    return;
  }
  if (shape === "rounded") {
    roundRect(c, x, y, w, h, Math.min(w, h) * 0.16);
    return;
  }
  const radius = Math.min(w, h) / 2;
  c.beginPath();
  if (shape === "scallop") {
    // Sixteen shallow lobes give the edge a frilled look without changing the cut size.
    const lobes = 16;
    const steps = lobes * 12;
    for (let i = 0; i <= steps; i += 1) {
      const t = (i / steps) * Math.PI * 2 - Math.PI / 2;
      const rr = radius * 0.955 + radius * 0.045 * Math.cos(lobes * t);
      const px = cx + Math.cos(t) * rr;
      const py = cy + Math.sin(t) * rr;
      if (i) c.lineTo(px, py);
      else c.moveTo(px, py);
    }
    c.closePath();
    return;
  }
  // The classic circle is also the fallback for an unknown value.
  c.arc(cx, cy, radius, 0, Math.PI * 2);
  c.closePath();
}

/**
 * A printed gift tag. The tag is cut from card stock, so the silhouette decides the shape, the
 * card colour shows around the photo, and a punched eyelet at the top carries the string. A
 * single tag and a whole tiled sheet share the same painter, so the preview and the download can
 * never disagree about where the cut line or the punch falls.
 */
function drawGiftTag(c, s, guides) {
  const r = s.rect;
  if (s.sheet) {
    // A print sheet of tags: the paper is blank stock and the tags are seated in a grid with a
    // small gutter, so a trimmer pass down each gutter separates the whole run.
    const grid = s.grid;
    const pxPerCm = r.w / grid.sheet.widthCm;
    const tagW = grid.tag.widthCm * pxPerCm;
    const tagH = grid.tag.heightCm * pxPerCm;
    const gutter = grid.gutterCm * pxPerCm;
    const blockW = grid.cols * tagW + (grid.cols - 1) * gutter;
    const blockH = grid.rows * tagH + (grid.rows - 1) * gutter;
    const originX = r.x + (r.w - blockW) / 2;
    const originY = r.y + (r.h - blockH) / 2;
    c.save();
    if (guides) {
      c.shadowColor = "rgba(29,36,32,.22)";
      c.shadowBlur = 28;
      c.shadowOffsetY = 12;
    }
    c.fillStyle = "#ffffff";
    c.fillRect(r.x, r.y, r.w, r.h);
    c.restore();
    c.save();
    c.strokeStyle = "rgba(29,36,32,.18)";
    c.lineWidth = Math.max(1, r.w * 0.0016);
    c.setLineDash([Math.max(2, gutter * 0.34), Math.max(2, gutter * 0.3)]);
    for (let col = 1; col < grid.cols; col += 1) {
      const x = originX + col * tagW + (col - 0.5) * gutter;
      c.beginPath();
      c.moveTo(x, originY - gutter * 0.5);
      c.lineTo(x, originY + blockH + gutter * 0.5);
      c.stroke();
    }
    for (let row = 1; row < grid.rows; row += 1) {
      const y = originY + row * tagH + (row - 0.5) * gutter;
      c.beginPath();
      c.moveTo(originX - gutter * 0.5, y);
      c.lineTo(originX + blockW + gutter * 0.5, y);
      c.stroke();
    }
    c.restore();
    for (let row = 0; row < grid.rows; row += 1) {
      for (let col = 0; col < grid.cols; col += 1) {
        // A sheet of tags is punched and threaded after it is cut, so the string is only drawn
        // on the single-tag preview where it explains what the hole is for.
        drawGiftTagOne(c, originX + col * (tagW + gutter), originY + row * (tagH + gutter), tagW, tagH, s, guides, false);
      }
    }
    return;
  }
  drawGiftTagOne(c, r.x, r.y, r.w, r.h, s, guides, guides);
}

/** One tag: the card silhouette, the photo, the message and To / From lines, the eyelet and the cut line. */
function drawGiftTagOne(c, x, y, w, h, s, guides, withString) {
  const ink = readableInk(s.paper);
  const family = s.font || DEFAULT_GIFT_TAG_FONT;
  const message = (s.text || "").trim();
  const fields = [];
  if (s.to) fields.push("To: " + s.to);
  if (s.from) fields.push("From: " + s.from);
  const hole = giftTagHole(w, h);
  const unit = Math.min(w, h);
  const cx = x + w / 2;
  const hx = x + hole.cx;
  const hy = y + hole.cy;
  const padX = w * (s.shape === "scallop" ? 0.14 : 0.09);
  const textW = Math.max(8, w - padX * 2);
  const rows = [];
  if (message) rows.push({ text: message, weight: 700, grow: 1.4 });
  for (const line of fields) rows.push({ text: line, weight: 500, grow: 1 });
  const totalGrow = rows.reduce((sum, row) => sum + row.grow, 0) || 1;
  const zoneTop = y + Math.max(hole.cy + hole.r + unit * 0.05, unit * 0.3);
  const zoneBottom = y + h - unit * 0.055;
  const zoneH = Math.max(1, zoneBottom - zoneTop);

  // Card stock: the silhouette is filled first so a blank tag still reads as a finished card.
  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.26)";
    c.shadowBlur = Math.max(6, w * 0.05);
    c.shadowOffsetY = Math.max(2, h * 0.018);
  }
  giftTagShapePath(c, s.shape, x, y, w, h);
  c.fillStyle = s.paper;
  c.fill();
  c.restore();

  c.save();
  giftTagShapePath(c, s.shape, x, y, w, h);
  c.clip();
  if (s.image) {
    drawCover(c, s.image, x, y, w, h);
  } else {
    c.fillStyle = "rgba(29,36,32,.04)";
    c.fillRect(x, y, w, h);
  }
  if (rows.length) {
    // The band is the card showing through, so the words stay readable over any photo.
    c.save();
    c.fillStyle = s.paper;
    c.globalAlpha = s.image ? 0.9 : 1;
    c.fillRect(x, zoneTop - unit * 0.02, w, zoneH + unit * 0.02);
    c.restore();
    c.save();
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    let cursor = zoneTop;
    for (const row of rows) {
      const rowH = zoneH * (row.grow / totalGrow);
      const size = fitFont(c, row.text, textW, rowH * 0.62, family, row.weight);
      c.font = row.weight + " " + size + "px " + family;
      c.fillText(row.text, cx, cursor + rowH / 2, textW);
      cursor += rowH;
    }
    c.restore();
  }
  c.restore();

  // The eyelet. On screen it reads as a punched hole with depth; on the print it stays a light
  // dashed circle so the punch guide never prints as a dark blob.
  c.save();
  if (guides) {
    c.beginPath();
    c.arc(hx, hy, hole.r, 0, Math.PI * 2);
    c.fillStyle = "rgba(29,36,32,.7)";
    c.fill();
    c.beginPath();
    c.arc(hx, hy + hole.r * 0.08, hole.r * 0.72, 0, Math.PI * 2);
    c.fillStyle = "rgba(10,14,12,.94)";
    c.fill();
  } else {
    c.beginPath();
    c.arc(hx, hy, hole.r, 0, Math.PI * 2);
    c.setLineDash([Math.max(1.5, hole.r * 0.55), Math.max(1.5, hole.r * 0.42)]);
    c.strokeStyle = "rgba(29,36,32,.5)";
    c.lineWidth = Math.max(0.8, hole.r * 0.24);
    c.stroke();
  }
  c.restore();

  if (withString) {
    // A short cord loop above the eyelet, drawn only in the preview so nobody prints a cord.
    c.save();
    c.strokeStyle = "#b7895a";
    c.lineWidth = Math.max(1.2, hole.r * 0.3);
    c.lineCap = "round";
    c.beginPath();
    c.ellipse(hx, hy - hole.r * 1.05, hole.r * 0.98, hole.r * 1.3, 0, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }

  // A hairline keeps the silhouette reading as card stock; the dashed line is the cut line.
  c.save();
  c.strokeStyle = "rgba(29,36,32,.16)";
  c.lineWidth = Math.max(0.8, unit * 0.004);
  giftTagShapePath(c, s.shape, x, y, w, h);
  c.stroke();
  c.setLineDash([Math.max(2, unit * 0.05), Math.max(2, unit * 0.035)]);
  c.strokeStyle = "rgba(29,36,32,.32)";
  c.lineWidth = Math.max(0.9, unit * 0.005);
  giftTagShapePath(c, s.shape, x, y, w, h);
  c.stroke();
  c.restore();
}

/** Builds one of the four tag silhouettes inside the given box. */
function giftTagShapePath(c, shape, x, y, w, h) {
  const unit = Math.min(w, h);
  if (shape === "square") {
    c.beginPath();
    c.rect(x, y, w, h);
    return;
  }
  if (shape === "rounded") {
    roundRect(c, x, y, w, h, unit * 0.12);
    return;
  }
  if (shape === "scallop") {
    // Shallow lobes sampled around an ellipse, so the edge reads as scalloped without changing
    // the size the tag is cut to.
    c.beginPath();
    const lobes = 20;
    const steps = lobes * 10;
    const cx = x + w / 2;
    const cy = y + h / 2;
    for (let i = 0; i <= steps; i += 1) {
      const t = (i / steps) * Math.PI * 2 - Math.PI / 2;
      const bump = 1 + 0.035 * Math.cos(lobes * t);
      const px = cx + Math.cos(t) * (w / 2) * 0.965 * bump;
      const py = cy + Math.sin(t) * (h / 2) * 0.965 * bump;
      if (i) c.lineTo(px, py);
      else c.moveTo(px, py);
    }
    c.closePath();
    return;
  }
  // The classic gift tag: chamfered shoulders under a narrow top edge, then straight sides down
  // to a flat foot, which is the shape a shop-bought paper tag is die-cut to.
  const topEdge = w * 0.42;
  const shoulder = y + Math.min(w * 0.55, h * 0.2);
  c.beginPath();
  c.moveTo(x + (w - topEdge) / 2, y);
  c.lineTo(x + (w + topEdge) / 2, y);
  c.lineTo(x + w, shoulder);
  c.lineTo(x + w, y + h);
  c.lineTo(x, y + h);
  c.lineTo(x, shoulder);
  c.closePath();
}
/**
 * A printed photo booth strip. The paper, the frame gutters and the caption band all move with
 * the product size, so the same painter draws a single 2 x 6 in strip and the 4 x 6 in sheet
 * that carries two of them. The preview adds a drop shadow; the export never does.
 */
function drawPhotoStrip(c, s, guides) {
  const r = s.rect;
  const cols = Math.max(1, Number(s.spec.cols) || 1);
  const colW = r.w / cols;
  const radius = Math.min(colW * 0.1, r.h * 0.022);
  const ink = readableInk(s.paper);
  const quiet = ink === "#ffffff" ? "rgba(255,255,255," : "rgba(29,36,32,";
  const padX = colW * 0.085;
  const padY = colW * 0.075;
  const gutter = colW * 0.045;
  const captionH = s.caption ? colW * 0.3 : 0;
  const frameW = Math.max(8, colW - padX * 2);
  const framesH = Math.max(8, r.h - padY * 2 - captionH);
  const cellH = Math.max(8, (framesH - gutter * (s.count - 1)) / s.count);

  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.2)";
    c.shadowBlur = 26;
    c.shadowOffsetY = 12;
  }
  c.fillStyle = s.paper;
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.fill();
  c.restore();

  for (let col = 0; col < cols; col += 1) {
    const cx = r.x + colW * col + padX;
    for (let i = 0; i < s.count; i += 1) {
      const cy = r.y + padY + i * (cellH + gutter);
      const photo = s.photos[i];
      c.save();
      roundRect(c, cx, cy, frameW, cellH, Math.min(frameW, cellH) * 0.045);
      c.clip();
      if (photo) {
        drawCover(c, photo, cx, cy, frameW, cellH);
      } else {
        c.fillStyle = quiet + ".07)";
        c.fillRect(cx, cy, frameW, cellH);
        c.fillStyle = quiet + ".5)";
        c.font = "600 " + Math.max(9, Math.round(cellH * 0.17)) + "px " + DEFAULT_STRIP_FONT;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("Photo " + (i + 1), cx + frameW / 2, cy + cellH / 2);
      }
      c.restore();
    }

    if (s.caption) {
      const maxW = frameW * 0.98;
      let size = Math.max(9, Math.round(captionH * 0.46));
      c.save();
      c.fillStyle = ink;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = "600 " + size + "px " + s.font;
      while (size > 8 && c.measureText(s.caption).width > maxW) {
        size -= 1;
        c.font = "600 " + size + "px " + s.font;
      }
      c.fillText(s.caption, cx + frameW / 2, r.y + r.h - padY - captionH / 2, maxW);
      c.restore();
    }
  }

  if (guides && cols > 1) {
    // Preview only: where the two strips are cut apart. The printed sheet stays clean.
    c.save();
    c.strokeStyle = "rgba(29,36,32,.35)";
    c.setLineDash([9, 7]);
    c.lineWidth = Math.max(1, colW * 0.008);
    c.beginPath();
    c.moveTo(r.x + colW, r.y + r.h * 0.012);
    c.lineTo(r.x + colW, r.y + r.h * 0.988);
    c.stroke();
    c.restore();
  }
}

function drawMagnet(c, s) {
  const r = s.rect;
  const pad = Math.max(10, Math.min(r.w, r.h) * 0.055);
  const radius = Math.min(r.w, r.h) * 0.1;
  c.save();
  c.fillStyle = "#ffffff";
  roundRect(c, r.x - pad, r.y - pad, r.w + pad * 2, r.h + pad * 2, radius);
  c.fill();
  c.strokeStyle = "rgba(29,36,32,.14)";
  c.lineWidth = 1.4;
  c.stroke();
  c.restore();
  c.save();
  c.beginPath();
  roundRect(c, r.x, r.y, r.w, r.h, radius * 0.7);
  c.clip();
  c.drawImage(s.image, r.x, r.y, r.w, r.h);
  c.restore();
}

/** The chosen acrylic finish, falling back to the clearest blank. */
function plateFinish() {
  const value = finishSelect?.value;
  return isNamePlateFinish(value) ? value : "clear";
}

/** The three etched lines on the plate, each clipped so a pasted essay cannot break the layout. */
function namePlateLines() {
  const clip = (input, max) => (input?.value || "").trim().slice(0, max);
  return { name: clip(plateName, 28), title: clip(plateTitle, 32), company: clip(plateCompany, 40) };
}

/**
 * The desk plate carries type and an optional logo rather than a traced photo. A blank
 * canvas stands in for the artwork so the shared upload, preview and download plumbing
 * keeps working; the painter never reads it.
 */
function namePlateBlank() {
  const c = document.createElement("canvas");
  c.width = WORK_LONG_SIDE;
  c.height = Math.round(WORK_LONG_SIDE * 0.2);
  return c;
}

/** A desk name plate: a long acrylic slab etched with a name over a title and a company line. */
function drawNamePlate(c, s, guides) {
  const r = s.rect;
  const radius = Math.min(r.w, r.h) * 0.14;
  const bevel = Math.max(3, Math.min(r.w, r.h) * 0.055);
  const dark = s.finish === "black";

  if (guides) {
    // The wedge a desk name plate actually stands in. Preview only: it never enters a file.
    const baseH = Math.max(14, r.h * 0.3);
    const bx = r.x + r.w * 0.02;
    const bw = r.w * 0.96;
    const by = r.y + r.h + bevel * 1.4;
    c.save();
    c.shadowColor = "rgba(29,36,32,.28)";
    c.shadowBlur = bevel * 1.4;
    c.shadowOffsetY = bevel * 0.6;
    const metal = c.createLinearGradient(bx, by, bx, by + baseH);
    metal.addColorStop(0, "#d3d8d5");
    metal.addColorStop(0.42, "#939b96");
    metal.addColorStop(1, "#6a716d");
    c.fillStyle = metal;
    roundRect(c, bx, by, bw, baseH, baseH * 0.42);
    c.fill();
    c.restore();
    c.save();
    c.globalAlpha = 0.16;
    c.fillStyle = dark ? "#0f1211" : "#7c8681";
    roundRect(c, bx, by, bw, baseH * 0.52, baseH * 0.3);
    c.fill();
    c.restore();

    // A soft contact shadow so the slab sits on the stand instead of floating over it.
    c.save();
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = bevel * 1.6;
    c.shadowOffsetY = bevel * 0.8;
    c.fillStyle = dark ? "#171b1a" : "#ffffff";
    roundRect(c, r.x, r.y, r.w, r.h, radius);
    c.fill();
    c.restore();
  }

  // The acrylic body: a vertical gradient so the slab reads as material, not a flat swatch.
  const body = c.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
  if (dark) {
    body.addColorStop(0, "#343b38");
    body.addColorStop(0.44, "#1c211f");
    body.addColorStop(1, "#0d1110");
  } else if (s.finish === "frosted") {
    body.addColorStop(0, "#fdfdfb");
    body.addColorStop(0.5, "#ecefeb");
    body.addColorStop(1, "#d6dcd7");
  } else {
    body.addColorStop(0, "#ffffff");
    body.addColorStop(0.5, "#f3f6f4");
    body.addColorStop(1, "#dbe4df");
  }
  c.save();
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.fillStyle = body;
  c.fill();
  c.restore();

  // A glass sheen across the face, the way a polished acrylic plate catches the light.
  c.save();
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.clip();
  const sheen = c.createLinearGradient(r.x, r.y + r.h, r.x + r.w * 0.7, r.y);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.4, "rgba(255,255,255,0)");
  sheen.addColorStop(0.47, dark ? "rgba(255,255,255,.13)" : "rgba(255,255,255,.5)");
  sheen.addColorStop(0.56, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = sheen;
  c.fillRect(r.x, r.y, r.w, r.h);
  c.restore();

  // The etched frame and the inner bevel that a laser-cut acrylic plate carries.
  c.save();
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.strokeStyle = dark ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.9)";
  c.lineWidth = Math.max(1.4, bevel * 0.24);
  c.stroke();
  roundRect(c, r.x + bevel * 0.5, r.y + bevel * 0.5, r.w - bevel, r.h - bevel, radius * 0.86);
  c.strokeStyle = dark ? "rgba(0,0,0,.5)" : "rgba(29,36,32,.14)";
  c.lineWidth = 1.2;
  c.stroke();
  c.restore();

  drawNamePlateText(c, s, r.x, r.y, r.w, r.h, guides);
  if (markSize(s.logo).w) drawNamePlateLogo(c, s, r.x, r.y, r.w, r.h);
}

/**
 * The etched copy: a name in the chosen face, a smaller title under it and an optional
 * company line. The lines centre as one block, so a plate with no title still sits level.
 * An empty name shows a light placeholder in the preview and nothing at all in a download.
 */
function drawNamePlateText(c, s, x, y, w, h, guides) {
  const lines = s.lines || {};
  const ghost = !lines.name;
  const name = lines.name || (guides ? "Your Name" : "");
  if (!name) return;
  const family = nameFont?.value || DEFAULT_NAME_FONT;
  const dark = s.finish === "black";
  const ink = dark ? "#f4f1ea" : "#1d2420";
  const halo = dark ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.8)";
  const padX = w * 0.05;
  const logoRoom = markSize(s.logo).w ? w * 0.21 : 0;
  const maxWidth = w - padX * 2 - logoRoom;
  const nameSize = fitFont(c, name, maxWidth, h * 0.36, family, 700);
  const titleSize = lines.title ? fitFont(c, lines.title, maxWidth, h * 0.18, family, 600) : 0;
  const companySize = lines.company ? fitFont(c, lines.company, maxWidth, h * 0.155, family, 600) : 0;
  const gap = h * 0.045;
  const blockH = nameSize + (titleSize ? gap + titleSize : 0) + (companySize ? gap + companySize : 0);
  let cursor = y + (h - blockH) / 2;

  const drawLine = (text, size, weight, opacity) => {
    const cy = cursor + size / 2;
    c.save();
    c.font = weight + " " + size + "px " + family;
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.lineJoin = "round";
    c.globalAlpha = opacity;
    c.lineWidth = Math.max(2.5, size * 0.16);
    c.strokeStyle = halo;
    c.strokeText(text, x + padX, cy);
    c.fillStyle = ink;
    c.fillText(text, x + padX, cy);
    c.restore();
    cursor += size + gap;
  };

  drawLine(name, nameSize, 700, ghost ? 0.4 : 1);
  if (titleSize) drawLine(lines.title, titleSize, 600, 0.92);
  if (companySize) drawLine(lines.company, companySize, 600, 0.78);
}

/** Optional logo mark, pinned right of the plate and fitted whole inside its own tile. */
function drawNamePlateLogo(c, s, x, y, w, h) {
  const img = s.logo;
  const size = markSize(img);
  const tile = Math.min(h * 0.62, w * 0.16);
  const bx = x + w - w * 0.05 - tile;
  const by = y + (h - tile) / 2;
  const scale = Math.min(tile / size.w, tile / size.h);
  const dw = size.w * scale;
  const dh = size.h * scale;
  c.save();
  c.beginPath();
  roundRect(c, bx, by, tile, tile, tile * 0.2);
  c.clip();
  c.fillStyle = "rgba(255,255,255,.92)";
  c.fillRect(bx, by, tile, tile);
  c.drawImage(img, bx + (tile - dw) / 2, by + (tile - dh) / 2, dw, dh);
  c.restore();
  c.save();
  roundRect(c, bx, by, tile, tile, tile * 0.2);
  c.strokeStyle = "rgba(29,36,32,.16)";
  c.lineWidth = 1;
  c.stroke();
  c.restore();
}

/** A coaster blank: square or round acrylic with the photo cover-fitted and a clear rim. */
function drawCoaster(c, s, guides) {
  const r = s.rect;
  const round = s.shape === "round";
  const rim = Math.max(6, Math.min(r.w, r.h) * 0.035);
  const trace = (x, y, w, h) => {
    c.beginPath();
    if (round) c.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    else roundRect(c, x, y, w, h, Math.min(w, h) * 0.08);
  };
  if (guides) {
    // The drop shadow sells the acrylic thickness on screen and stays out of the export.
    c.save();
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = rim * 1.5;
    c.shadowOffsetY = rim * 0.7;
    trace(r.x + rim * 0.5, r.y + rim * 0.5, r.w - rim, r.h - rim);
    c.fillStyle = "#f7f5ef";
    c.fill();
    c.restore();
  }
  trace(r.x, r.y, r.w, r.h);
  c.save();
  c.fillStyle = "#fffdf8";
  c.fill();
  c.strokeStyle = "rgba(29,36,32,.18)";
  c.lineWidth = 1.5;
  c.stroke();
  c.restore();
  c.save();
  trace(r.x + rim, r.y + rim, r.w - rim * 2, r.h - rim * 2);
  c.clip();
  drawCover(c, s.image, r.x + rim, r.y + rim, r.w - rim * 2, r.h - rim * 2);
  c.restore();
}

/** A solid acrylic block: the photo sits on the front face, with the depth showing right and bottom. */
function drawBlock(c, s, guides) {
  const r = s.rect;
  const d = s.depth;
  const face = { x: r.x, y: r.y, w: r.w - d, h: r.h - d };
  const radius = Math.min(face.w, face.h) * 0.045;

  if (guides) {
    // The contact shadow sells the depth on screen but would only add stray pixels to an export.
    c.save();
    c.shadowColor = "rgba(29,36,32,.3)";
    c.shadowBlur = d * 1.1;
    c.shadowOffsetX = d * 0.16;
    c.shadowOffsetY = d * 0.72;
    c.fillStyle = "#eef3f1";
    roundRect(c, r.x, r.y, r.w, r.h, radius);
    c.fill();
    c.restore();
  }

  // The acrylic body: the exposed strip along the right and bottom is the block's thickness.
  const body = c.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
  body.addColorStop(0, "#fdfefd");
  body.addColorStop(0.42, "#e9f0ed");
  body.addColorStop(1, "#c8d7d2");
  c.save();
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.fillStyle = body;
  c.fill();
  c.strokeStyle = "rgba(255,255,255,.95)";
  c.lineWidth = Math.max(1, d * 0.08);
  c.stroke();
  c.restore();

  // The printed face, inset by the depth so the thickness reads as real material.
  c.save();
  roundRect(c, face.x, face.y, face.w, face.h, radius * 0.8);
  c.clip();
  drawCover(c, s.image, face.x, face.y, face.w, face.h);
  c.restore();

  // A glass sheen across the face, then the inner bevel that frames the photo.
  c.save();
  roundRect(c, face.x, face.y, face.w, face.h, radius * 0.8);
  c.clip();
  const sheen = c.createLinearGradient(face.x, face.y + face.h, face.x + face.w, face.y);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.36, "rgba(255,255,255,0)");
  sheen.addColorStop(0.46, "rgba(255,255,255,.22)");
  sheen.addColorStop(0.56, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = sheen;
  c.fillRect(face.x, face.y, face.w, face.h);
  c.restore();

  c.save();
  roundRect(c, face.x, face.y, face.w, face.h, radius * 0.8);
  c.strokeStyle = "rgba(255,255,255,.7)";
  c.lineWidth = Math.max(1, Math.min(face.w, face.h) * 0.009);
  c.stroke();
  c.restore();
}

function photoKeychainGeometry(L) {
  const r = { x: L.x, y: L.y, w: L.w, h: L.h };
  const pad = L.pad || Math.max(14, Math.min(r.w, r.h) * 0.075);
  const topBand = L.topBand || Math.max(46, Math.min(r.w, r.h) * 0.13);
  const outer = { x: r.x - pad, y: r.y - pad - topBand, w: r.w + pad * 2, h: r.h + pad * 2 + topBand };
  const holeR = Math.max(9, Math.min(outer.w, outer.h) * 0.045);
  const hole = { cx: outer.x + outer.w / 2, cy: outer.y + topBand * 0.62, r: holeR };
  return { outer, hole };
}

function drawPhotoKeychain(c, s, guides) {
  const r = s.rect;
  const o = s.outer;
  const h = s.hole;
  const shape = s.shape || "rounded";

  if (guides) {
    const ringRadius = h.r * 1.8;
    c.save();
    c.strokeStyle = "#98a09b";
    c.lineWidth = Math.max(3, h.r * 0.28);
    c.beginPath();
    c.arc(h.cx, h.cy, ringRadius, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }

  c.save();
  pathForKeychain(c, o.x, o.y, o.w, o.h, shape, Math.min(o.w, o.h) * 0.14);
  c.fillStyle = "#fffdf8";
  c.fill();
  c.strokeStyle = "rgba(29,36,32,.18)";
  c.lineWidth = 1.5;
  c.stroke();
  c.restore();

  c.save();
  if (shape === "circle") {
    c.beginPath();
    c.arc(r.x + r.w / 2, r.y + r.h / 2, Math.min(r.w, r.h) / 2, 0, Math.PI * 2);
    c.clip();
  } else {
    pathForKeychain(c, r.x, r.y, r.w, r.h, shape, Math.min(r.w, r.h) * 0.08);
    c.clip();
  }
  if (shape === "rounded") c.drawImage(s.image, r.x, r.y, r.w, r.h);
  else drawCover(c, s.image, r.x, r.y, r.w, r.h);
  c.restore();

  c.save();
  c.globalCompositeOperation = "destination-out";
  c.beginPath();
  c.arc(h.cx, h.cy, h.r, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

function nameHole(L) {
  // The welded tab sits at the top centre, so its hole is a fixed ratio of the artwork box.
  return { cx: L.x + L.w / 2, cy: L.y + L.h * 0.121, r: Math.max(8, L.h * 0.071) };
}

function drawNameKeychain(c, s, guides) {
  const r = s.rect;
  const h = s.hole;
  const depth = Math.max(3, Math.min(r.w, r.h) * 0.014);

  c.save();
  c.globalAlpha = 0.16;
  c.save();
  c.translate(depth * 1.1, depth * 1.7);
  c.drawImage(s.image, r.x, r.y, r.w, r.h);
  c.restore();
  c.restore();

  c.drawImage(s.image, r.x, r.y, r.w, r.h);

  c.save();
  c.globalCompositeOperation = "destination-out";
  c.beginPath();
  c.arc(h.cx, h.cy, h.r, 0, Math.PI * 2);
  c.fill();
  c.restore();

  if (guides) {
    c.save();
    c.strokeStyle = "#98a09b";
    c.lineWidth = Math.max(3, h.r * 0.3);
    c.beginPath();
    c.arc(h.cx, h.cy - h.r * 1.15, h.r * 1.75, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }
}

// ------------------------------------------------------------------ luggage tag

/** Up to two engraved lines: a name on top and one contact line under it. */
function luggageTagLines() {
  const name = (engravingInput?.value || "").trim().slice(0, 24);
  const contact = (contactInput?.value || "").trim().slice(0, 30);
  return [name, contact].filter(Boolean);
}

/**
 * Etched contact block. The lines climb from the base of the tag, shrinking to fit the
 * width at each band, with a soft dark halo so the text survives a busy photo and a print.
 */
function drawTagText(c, lines, x, y, w, h) {
  if (!lines || !lines.length) return;
  const family = "Inter, 'Segoe UI', system-ui, sans-serif";
  const base = Math.min(w, h);
  const maxWidth = w * 0.78;
  let cursor = y + h * 0.9;
  for (let i = lines.length - 1; i >= 0; i--) {
    const text = lines[i];
    const startSize = base * (i === 0 ? 0.12 : 0.085);
    const size = fitFont(c, text, maxWidth, startSize, family, 700);
    cursor -= size * 0.72;
    c.save();
    c.font = "700 " + size + "px " + family;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineJoin = "round";
    c.lineWidth = Math.max(3, size * 0.17);
    c.strokeStyle = "rgba(29,36,32,.5)";
    c.strokeText(text, x + w / 2, cursor);
    c.fillStyle = "#ffffff";
    c.fillText(text, x + w / 2, cursor);
    c.restore();
    cursor -= size * 0.6;
  }
}

function drawLuggageTag(c, s, guides) {
  const r = s.rect;
  const hole = s.hole;

  if (guides) {
    c.save();
    c.globalAlpha = 0.18;
    c.filter = "blur(8px)";
    c.fillStyle = "#1d2420";
    c.beginPath();
    addPolygon(c, s.outline.map(([x, y]) => [x + 4, y + 10]));
    c.fill();
    c.restore();
  }

  // Clear acrylic tag face with the photo behind it and the contact block etched on top.
  c.save();
  c.beginPath();
  addPolygon(c, s.outline);
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  drawCover(c, s.image, r.x, r.y, r.w, r.h);
  drawTagText(c, s.lines, r.x, r.y, r.w, r.h);
  c.restore();

  // The strap hole is punched out, so the exported file can be printed and cut as-is.
  c.save();
  c.globalCompositeOperation = "destination-out";
  c.beginPath();
  c.arc(hole.cx, hole.cy, hole.r, 0, Math.PI * 2);
  c.fill();
  c.restore();

  if (guides) {
    c.save();
    c.beginPath();
    addPolygon(c, s.outline);
    c.strokeStyle = "rgba(255,255,255,.8)";
    c.lineWidth = 6;
    c.stroke();
    c.strokeStyle = "rgba(29,36,32,.18)";
    c.lineWidth = 1.6;
    c.stroke();
    c.restore();
    drawTagStrap(c, hole);
  }
}

/** Preview-only strap loop, so the mockup reads as a tag tied to a bag handle. */
function drawTagStrap(c, hole) {
  const r = hole.r;
  c.save();
  c.lineCap = "round";
  c.lineWidth = Math.max(4, r * 0.42);
  c.strokeStyle = "#8a6a45";
  c.beginPath();
  c.arc(hole.cx, hole.cy - r * 1.7, r * 1.6, Math.PI * 1.15, Math.PI * 1.85);
  c.stroke();
  c.strokeStyle = "rgba(255,255,255,.35)";
  c.lineWidth = Math.max(1, r * 0.1);
  c.stroke();
  c.restore();
}

// ------------------------------------------------------------------ bookmark

/** Up to two engraved lines: a title on top and a note or a date under it. */
function bookmarkLines() {
  const title = (engravingInput?.value || "").trim().slice(0, 28);
  const note = (contactInput?.value || "").trim().slice(0, 32);
  return [title, note].filter(Boolean);
}

/**
 * Etched caption for a bookmark. A bookmark slab is narrow, so the type is measured against
 * the width of the slab rather than its height, and the lines sit low on the face so the
 * photo keeps the top two thirds of the piece. The ribbon notch and the tapered tip both eat
 * into the bottom of the silhouette, so those shapes lift the caption clear of the cut line.
 */
function drawBookmarkText(c, lines, x, y, w, h, shape) {
  if (!lines || !lines.length) return;
  const family = "Inter, 'Segoe UI', system-ui, sans-serif";
  const maxWidth = w * 0.84;
  const taper = shape === "notch" ? h * 0.16 : shape === "pointed" ? h * 0.2 : 0;
  let cursor = y + h - taper - w * 0.12;
  for (let i = lines.length - 1; i >= 0; i--) {
    const text = lines[i];
    const startSize = w * (i === 0 ? 0.24 : 0.15);
    const size = fitFont(c, text, maxWidth, startSize, family, 700);
    cursor -= size * 0.75;
    c.save();
    c.font = "700 " + size + "px " + family;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineJoin = "round";
    c.lineWidth = Math.max(3, size * 0.2);
    c.strokeStyle = "rgba(29,36,32,.5)";
    c.strokeText(text, x + w / 2, cursor);
    c.fillStyle = "#ffffff";
    c.fillText(text, x + w / 2, cursor);
    c.restore();
    cursor -= size * 0.62;
  }
}

function drawBookmark(c, s, guides) {
  const r = s.rect;
  const hole = s.hole;

  if (guides) {
    c.save();
    c.globalAlpha = 0.18;
    c.filter = "blur(8px)";
    c.fillStyle = "#1d2420";
    c.beginPath();
    addPolygon(c, s.outline.map(([x, y]) => [x + 4, y + 10]));
    c.fill();
    c.restore();
  }

  // Acrylic bookmark face: the photo fills the slab and the caption is etched on top.
  c.save();
  c.beginPath();
  addPolygon(c, s.outline);
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  drawCover(c, s.image, r.x, r.y, r.w, r.h);
  drawBookmarkText(c, s.lines, r.x, r.y, r.w, r.h, s.shape);
  c.restore();

  // The tassel hole is punched out, so the exported file can be printed and cut as-is.
  c.save();
  c.globalCompositeOperation = "destination-out";
  c.beginPath();
  c.arc(hole.cx, hole.cy, hole.r, 0, Math.PI * 2);
  c.fill();
  c.restore();

  if (guides) {
    c.save();
    c.beginPath();
    addPolygon(c, s.outline);
    c.strokeStyle = "rgba(255,255,255,.8)";
    c.lineWidth = 6;
    c.stroke();
    c.strokeStyle = "rgba(29,36,32,.18)";
    c.lineWidth = 1.6;
    c.stroke();
    c.restore();
    drawTassel(c, hole);
  }
}

/** Preview-only tassel, so the mockup reads as a bookmark with a cord through the hole. */
function drawTassel(c, hole) {
  const r = hole.r;
  c.save();
  c.lineCap = "round";
  c.lineWidth = Math.max(3, r * 0.34);
  c.strokeStyle = "#b8894f";
  c.beginPath();
  c.moveTo(hole.cx, hole.cy);
  c.quadraticCurveTo(hole.cx + r * 1.1, hole.cy - r * 4, hole.cx + r * 2, hole.cy - r * 6.4);
  c.stroke();
  const bx = hole.cx + r * 2;
  const by = hole.cy - r * 6.4;
  for (let i = -2; i <= 2; i++) {
    c.strokeStyle = i % 2 ? "#a9762f" : "#d0a05c";
    c.lineWidth = Math.max(2, r * 0.2);
    c.beginPath();
    c.moveTo(bx, by);
    c.quadraticCurveTo(bx + i * r * 0.5, by + r * 3.2, bx + i * r * 0.95, by + r * 6.4);
    c.stroke();
  }
  c.restore();
}

// ------------------------------------------------------------------ ornament

function ornamentText() {
  return (engravingInput?.value || "").trim().slice(0, 24);
}

/** Largest font size (down to 8px) at which `text` still fits `maxWidth`. */
function fitFont(c, text, maxWidth, startSize, family, weight) {
  let size = Math.max(8, startSize);
  for (; size > 8; size -= 1) {
    c.font = `${weight} ${size}px ${family}`;
    if (c.measureText(text).width <= maxWidth) break;
  }
  return size;
}

/**
 * Etched-looking caption. White face plus a soft dark halo so the name stays readable
 * over a dark or a light photo, and survives being printed.
 */
function drawOrnamentEngraving(c, text, x, y, w, h, outline) {
  if (!text) return;
  const family = "Inter, 'Segoe UI', system-ui, sans-serif";
  const size = fitFont(c, text, w * 0.72, Math.min(w, h) * 0.11, family, 800);
  c.save();
  c.font = `800 ${size}px ${family}`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  const textWidth = c.measureText(text).width;
  const margin = Math.max(6, size * 0.45);
  // Start near the base and climb until the silhouette is wide enough to hold the caption,
  // so a heart or star never slices the engraved name in half.
  let baseline = y + h * 0.855;
  if (outline && outline.length) {
    for (let f = 0.855; f >= 0.6; f -= 0.015) {
      const ty = y + h * f;
      const span = widthAtY(outline, ty);
      if (span && span.width >= textWidth + margin * 2) { baseline = ty; break; }
    }
  }
  c.lineJoin = "round";
  c.lineWidth = Math.max(3, size * 0.16);
  c.strokeStyle = "rgba(29,36,32,.45)";
  c.strokeText(text, x + w / 2, baseline);
  c.fillStyle = "#ffffff";
  c.fillText(text, x + w / 2, baseline);
  c.restore();
}

function drawOrnament(c, s, guides) {
  const r = s.rect;
  const hole = s.hole;

  if (guides) {
    c.save();
    c.globalAlpha = 0.18;
    c.filter = "blur(8px)";
    c.fillStyle = "#1d2420";
    c.beginPath();
    addPolygon(c, s.outline.map(([x, y]) => [x + 4, y + 10]));
    c.fill();
    c.restore();
  }

  // Clear acrylic disc with the photo floated behind it.
  c.save();
  c.beginPath();
  addPolygon(c, s.outline);
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  drawCover(c, s.image, r.x, r.y, r.w, r.h);
  drawOrnamentEngraving(c, s.text, r.x, r.y, r.w, r.h, s.outline);
  c.restore();

  // The hole is punched out, so the exported file can be printed, cut and drilled as-is.
  c.save();
  c.globalCompositeOperation = "destination-out";
  c.beginPath();
  c.arc(hole.cx, hole.cy, hole.r, 0, Math.PI * 2);
  c.fill();
  c.restore();

  if (guides) {
    c.save();
    c.beginPath();
    addPolygon(c, s.outline);
    c.strokeStyle = "rgba(255,255,255,.8)";
    c.lineWidth = 6;
    c.stroke();
    c.strokeStyle = "rgba(29,36,32,.18)";
    c.lineWidth = 1.6;
    c.stroke();
    c.restore();
    drawHanger(c, hole);
  }
}

/** Preview-only ribbon loop, so the mockup reads as a hanging ornament. */
function drawHanger(c, hole) {
  const r = hole.r;
  c.save();
  c.lineCap = "round";
  c.lineWidth = Math.max(3, r * 0.3);
  c.strokeStyle = "#c0472f";
  c.beginPath();
  c.arc(hole.cx, hole.cy - r * 1.9, r * 1.7, Math.PI * 1.12, Math.PI * 1.88);
  c.stroke();
  c.strokeStyle = "rgba(255,255,255,.45)";
  c.lineWidth = Math.max(1, r * 0.09);
  c.stroke();
  c.restore();
}

// ------------------------------------------------------------------ cake topper

/** The traced letters, scaled from the traced source into the live preview box. */
function topperOutline(L) {
  if (!rawContours || !rawContours.length) return [];
  const sx = L.w / rawSource.width;
  const sy = L.h / rawSource.height;
  const tolerance = Math.max(0.4, Math.min(L.w, L.h) / 520);
  return rawContours.map((contour) => {
    const simplified = simplifyPath(contour, tolerance);
    return scalePath(simplified, sx, sy).map(([x, y]) => [x + L.x, y + L.y]);
  });
}

function drawCakeTopper(c, s, guides) {
  const r = s.rect;
  if (!s.outline.length) return;
  const depth = Math.max(3, Math.min(r.w, r.h) * 0.014);

  if (guides) {
    // The dowel is decoration: it sits behind the acrylic and never reaches the export.
    drawTopperStick(c, r);
    c.save();
    c.globalAlpha = 0.16;
    c.translate(depth * 1.4, depth * 2.2);
    c.fillStyle = "#1d2420";
    c.beginPath();
    for (const pts of s.outline) addPolygon(c, pts);
    c.fill("evenodd");
    c.restore();
  }

  // Acrylic face: a white sheet with the optional photo floated inside the cut shape.
  c.save();
  c.beginPath();
  for (const pts of s.outline) addPolygon(c, pts);
  c.clip("evenodd");
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  if (s.image && s.image.naturalWidth) drawCover(c, s.image, r.x, r.y, r.w, r.h);
  c.restore();

  if (guides) {
    c.save();
    c.setLineDash([7, 6]);
    c.lineWidth = 1.6;
    c.strokeStyle = "rgba(239,105,76,.9)";
    c.beginPath();
    for (const pts of s.outline) addPolygon(c, pts);
    c.stroke();
    c.restore();
  }
}

/** Preview-only dowel, so the mockup reads as a topper standing in a cake. */
function drawTopperStick(c, r) {
  const width = Math.max(7, Math.min(r.w, r.h) * 0.055);
  const cx = r.x + r.w / 2;
  const top = r.y + r.h * 0.6;
  const bottom = r.y + r.h + Math.max(90, r.h * 0.8);
  c.save();
  c.fillStyle = "#f1e7d4";
  c.strokeStyle = "rgba(122,104,76,.45)";
  c.lineWidth = 1.2;
  roundRect(c, cx - width / 2, top, width, bottom - top, width * 0.4);
  c.fill();
  c.stroke();
  c.restore();
}

function pathForKeychain(c, x, y, w, h, shape, radius) {
  if (shape === "circle") {
    c.beginPath();
    c.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    return;
  }
  roundRect(c, x, y, w, h, radius || Math.min(w, h) * 0.12);
}

function drawCover(c, img, x, y, w, h) {
  const sourceRatio = img.naturalWidth / img.naturalHeight;
  const destRatio = w / h;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (sourceRatio > destRatio) {
    sw = sh * destRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = sw / destRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  c.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawStandee(c, s) {
  const r = s.rect;
  const margin = 9;
  c.save();
  c.fillStyle = "rgba(29,36,32,.15)";
  roundRect(c, r.x - margin, r.y - margin, r.w + margin * 2, r.h + margin * 2, 14);
  c.fill();
  c.restore();
  c.drawImage(s.image, r.x, r.y, r.w, r.h);
  const baseH = Math.max(28, r.h * 0.14);
  const baseW = r.w * 0.74;
  const baseX = r.x + (r.w - baseW) / 2;
  const baseY = r.y + r.h + 13;
  const gradient = c.createLinearGradient(baseX, baseY, baseX, baseY + baseH);
  gradient.addColorStop(0, "#f6e9d4");
  gradient.addColorStop(1, "#d6bd97");
  c.save();
  c.fillStyle = gradient;
  roundRect(c, baseX, baseY, baseW, baseH, 9);
  c.fill();
  c.strokeStyle = "rgba(29,36,32,.16)";
  c.lineWidth = 1;
  c.stroke();
  c.restore();
}

function addPolygon(c, points) {
  c.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
  c.closePath();
}

/** Natural pixel size of a loaded image, or zeroes when there is nothing to place. */
function markSize(img) {
  if (!img) return { w: 0, h: 0 };
  return { w: img.naturalWidth || img.width || 0, h: img.naturalHeight || img.height || 0 };
}
function roundRect(c, x, y, w, h, radius) {
  c.beginPath();
  if (typeof c.roundRect === "function") c.roundRect(x, y, w, h, radius);
  else c.rect(x, y, w, h);
}

// ------------------------------------------------------------------ export

/**
 * The three ruled lines under one writing band. Blue red blue is the school paper parents ask for
 * by name, so the top and base lines share a blue and only the middle line is red and dashed.
 */
function nameTracingLines(c, rule, x, w, topY, midY, baseY) {
  const lineH = Math.max(1, baseY - topY);
  c.save();
  c.lineWidth = Math.max(0.8, lineH * 0.035);
  c.setLineDash([]);
  if (rule.top) {
    c.strokeStyle = rule.top;
    c.beginPath();
    c.moveTo(x, topY);
    c.lineTo(x + w, topY);
    c.stroke();
  }
  if (rule.mid) {
    c.strokeStyle = rule.mid;
    c.setLineDash(rule.dashMid ? [Math.max(2, lineH * 0.14), Math.max(2, lineH * 0.12)] : []);
    c.beginPath();
    c.moveTo(x, midY);
    c.lineTo(x + w, midY);
    c.stroke();
  }
  if (rule.base) {
    c.setLineDash([]);
    c.strokeStyle = rule.base;
    c.beginPath();
    c.moveTo(x, baseY);
    c.lineTo(x + w, baseY);
    c.stroke();
  }
  c.restore();
}

/** One writing row: the name is repeated across the line as many times as it cleanly fits. */
function nameTracingRowText(c, x, y, w, fontPx, text, style, ink, alpha) {
  if (!text) return;
  c.save();
  c.font = "700 " + fontPx + "px " + NAME_TRACING_FONT;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  const unitW = Math.max(1, c.measureText(text).width);
  const slots = nameTracingSlots(w, unitW * 1.22, 8);
  c.globalAlpha = alpha;
  c.lineJoin = "round";
  for (let i = 0; i < slots.count; i += 1) {
    const cx = x + slots.slotW * (i + 0.5);
    if (style.mode === "fill") {
      c.fillStyle = ink;
      c.fillText(text, cx, y);
    } else {
      c.strokeStyle = ink;
      c.lineWidth = Math.max(1, fontPx * 0.048);
      c.setLineDash(style.dash ? style.dash.map((k) => Math.max(1, k * fontPx)) : []);
      c.strokeText(text, cx, y);
    }
  }
  c.restore();
}

/**
 * The whole worksheet: paper, a Name and Date header, the guided model row, the tracing rows and
 * the blank rows for free writing. Every measurement comes from the shared sheet recipe, so the
 * preview and the 300 DPI download put the ruled lines in the same place.
 */
function drawNameTracing(c, s, guides) {
  const r = s.rect;
  const sheet = s.sheet;
  const paper = s.paper || sheet.paper;
  const pxPerCm = r.w / paper.widthCm;
  const margin = sheet.marginCm * pxPerCm;
  const usableW = sheet.usableW * pxPerCm;
  const band = sheet.bandCm * pxPerCm;
  const linePx = sheet.lineCm * pxPerCm;
  const text = (s.text || "").trim();
  const style = s.style;
  const rule = s.rule;
  const ink = s.ink;
  const guide = s.guide !== false;

  // The paper itself, with the page shadow that only the on-screen preview carries.
  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = 26;
    c.shadowOffsetY = 12;
  }
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  c.restore();

  const left = r.x + margin;
  let top = r.y + margin;

  // The Name and Date header, written in the same graphite as the rows.
  if (sheet.headerRows) {
    const headerPx = sheet.headerCm * pxPerCm;
    const headSize = Math.max(8, Math.min(headerPx * 0.36, linePx * 0.52));
    const labelY = top + headerPx * 0.42;
    const ruleY = top + headerPx * 0.72;
    c.save();
    c.fillStyle = "rgba(74,82,80,.82)";
    c.font = "600 " + headSize + "px " + NAME_TRACING_FONT;
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.fillText("Name", left, labelY);
    const nameW = c.measureText("Name").width;
    c.fillText("Date", left + usableW * 0.66, labelY);
    const dateW = c.measureText("Date").width;
    c.strokeStyle = "rgba(74,82,80,.45)";
    c.lineWidth = Math.max(0.8, linePx * 0.045);
    c.setLineDash([Math.max(2, linePx * 0.1), Math.max(2, linePx * 0.08)]);
    c.beginPath();
    c.moveTo(left + nameW + linePx * 0.22, ruleY);
    c.lineTo(left + usableW * 0.62, ruleY);
    c.moveTo(left + usableW * 0.66 + dateW + linePx * 0.22, ruleY);
    c.lineTo(left + usableW, ruleY);
    c.stroke();
    c.restore();
    top += headerPx;
  }

  // Each band is one writing row; the guided model row sits above the tracing rows.
  const rowCount = sheet.totalRows;
  const startsGuide = guide && sheet.guideRows === 1;
  for (let row = 0; row < rowCount; row += 1) {
    const rowTop = top + row * band;
    const topY = rowTop + (band - linePx) / 2;
    const midY = topY + linePx / 2;
    const baseY = topY + linePx;
    nameTracingLines(c, rule, left, usableW, topY, midY, baseY);
    const isGuide = startsGuide && row === 0;
    const isBlank = row >= sheet.guideRows + sheet.practiceRows;
    if (!isBlank && text) {
      const fontPx = linePx * 0.8;
      if (isGuide) {
        // The model row is a solid, lighter copy of the name so the child follows it first.
        nameTracingRowText(c, left, baseY, usableW, fontPx, text, { mode: "fill", dash: null }, ink, 0.42);
      } else {
        nameTracingRowText(c, left, baseY, usableW, fontPx, text, style, ink, style.alpha === undefined ? 1 : style.alpha);
      }
    }
  }

  // A quiet footer so a printed sheet still points back to the tool without shouting.
  c.save();
  c.fillStyle = "rgba(29,36,32,.3)";
  c.font = "500 " + Math.max(6, linePx * 0.22) + "px " + NAME_TRACING_FONT;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  c.fillText("Name tracing worksheet - free at Tiny County Makers", r.x + r.w / 2, r.y + r.h - margin * 0.42);
  c.restore();
}

/**
 * The whole puzzle sheet: paper, the title band, the square of letters, the highlighted answer
 * overlay and the word list underneath. Every measurement is read from the shared sheet recipe in
 * centimetres, so the live preview and the 300 DPI download land the same grid in the same place.
 */
function drawWordSearch(c, s, guides) {
  const r = s.rect;
  const sheet = s.sheet;
  const paper = s.paper || sheet.paper;
  const pxPerCm = r.w / paper.widthCm;
  const build = s.build;
  const cells = build ? build.cells : sheet.cells;
  const gridPx = sheet.gridCm * pxPerCm;
  const cellPx = gridPx / Math.max(1, cells);
  const gx = r.x + sheet.gridX * pxPerCm;
  const gy = r.y + sheet.gridY * pxPerCm;
  const margin = sheet.marginCm * pxPerCm;

  c.save();
  // The sheet itself, with a hairline edge so the paper reads against the page behind it.
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  c.strokeStyle = "#dcd7cc";
  c.lineWidth = Math.max(1, pxPerCm * 0.02);
  c.strokeRect(r.x + c.lineWidth / 2, r.y + c.lineWidth / 2, r.w - c.lineWidth, r.h - c.lineWidth);

  // The title band, or the default name when the visitor has not typed one.
  if (sheet.titleCm > 0) {
    const titlePx = Math.min(sheet.titleCm * pxPerCm * 0.62, pxPerCm * 1.15);
    c.fillStyle = WORD_SEARCH_INK;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "700 " + Math.max(8, titlePx) + "px " + WORD_SEARCH_FONT;
    c.fillText((s.title || "").trim() || "Word search", r.x + r.w / 2, r.y + sheet.marginCm * pxPerCm + (sheet.titleCm * pxPerCm) / 2, sheet.usableW * pxPerCm);
  }

  // Faint cell rules, so the squares the words hide in stay readable on a printed sheet.
  c.strokeStyle = WORD_SEARCH_RULE;
  c.lineWidth = Math.max(0.5, cellPx * 0.035);
  c.beginPath();
  for (let i = 0; i <= cells; i += 1) {
    const x = gx + i * cellPx;
    const y = gy + i * cellPx;
    c.moveTo(x, gy);
    c.lineTo(x, gy + gridPx);
    c.moveTo(gx, y);
    c.lineTo(gx + gridPx, y);
  }
  c.stroke();
  if (guides) {
    // The preview gets one crisp edge so the grid reads as a finished square on screen.
    c.strokeStyle = "#9aa2ab";
    c.lineWidth = Math.max(0.8, cellPx * 0.06);
    c.strokeRect(gx, gy, gridPx, gridPx);
  }

  // The answer overlay sits under the letters, as a soft band along each hidden word.
  if (s.answers && build) {
    c.strokeStyle = WORD_SEARCH_ANSWER;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.lineWidth = cellPx * 0.78;
    build.placements.forEach((placement) => {
      const path = wordSearchPath(placement);
      if (!path.length) return;
      c.beginPath();
      path.forEach(([row, col], index) => {
        const cx = gx + col * cellPx + cellPx / 2;
        const cy = gy + row * cellPx + cellPx / 2;
        if (index === 0) c.moveTo(cx, cy);
        else c.lineTo(cx, cy);
      });
      c.stroke();
    });
  }

  // The letters of the puzzle, in whichever case the sheet was set in.
  c.fillStyle = WORD_SEARCH_INK;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = "600 " + Math.max(4, cellPx * 0.6) + "px " + WORD_SEARCH_FONT;
  if (build) {
    for (let row = 0; row < cells; row += 1) {
      for (let col = 0; col < cells; col += 1) {
        const letter = build.grid[row][col];
        if (!letter) continue;
        c.fillText(wordSearchWord(letter, s.caseId), gx + col * cellPx + cellPx / 2, gy + row * cellPx + cellPx / 2 + cellPx * 0.02, cellPx * 0.92);
      }
    }
  }

  // The word list under the grid, folded into as many columns as the list needs.
  const list = Array.isArray(s.words) ? s.words : [];
  if (sheet.listCm > 0 && list.length) {
    const columns = wordSearchListColumns(list);
    const perColumn = Math.ceil(list.length / columns);
    const colW = (sheet.usableW * pxPerCm) / columns;
    const listTop = gy + gridPx + pxPerCm * 0.45;
    const rowH = Math.min((sheet.listCm * pxPerCm) / perColumn, cellPx * 2.2);
    const fontPx = Math.max(4, Math.min(rowH * 0.68, cellPx * 1.05));
    c.font = "600 " + fontPx + "px " + WORD_SEARCH_FONT;
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.fillStyle = WORD_SEARCH_INK;
    list.forEach((word, index) => {
      const column = Math.floor(index / perColumn);
      const row = index % perColumn;
      c.fillText(wordSearchWord(word, s.caseId), r.x + margin + column * colW, listTop + (row + 0.5) * rowH, colW * 0.94);
    });
  }

  // The same small footer line on screen and in the print, so the free sheet always credits back.
  c.fillStyle = "#8a9098";
  c.font = "500 " + Math.max(4, pxPerCm * 0.26) + "px " + WORD_SEARCH_FONT;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  c.fillText("Word search puzzle - free at Tiny County Makers", r.x + r.w / 2, r.y + r.h - margin * 0.38);
  c.restore();
}

/** The bingo sheet: one to four cards on a page, plus the caller's list when it is switched on. */
function drawBingo(c, s, guides) {
  const r = s.rect;
  const sheet = s.sheet;
  const paper = s.paper || sheet.paper;
  const pxPerCm = r.w / paper.widthCm;
  const perSheet = Math.max(1, sheet.layout.cols * sheet.layout.rows);

  c.save();
  // The sheet itself, with a hairline edge so the paper reads against the page behind it.
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  c.strokeStyle = "#dcd7cc";
  c.lineWidth = Math.max(1, pxPerCm * 0.02);
  c.strokeRect(r.x + c.lineWidth / 2, r.y + c.lineWidth / 2, r.w - c.lineWidth, r.h - c.lineWidth);

  const cards = Array.isArray(s.cards) ? s.cards : [];
  if (s.page < s.cardSheets) {
    for (let slot = 0; slot < perSheet; slot += 1) {
      const number = s.page * perSheet + slot;
      const card = cards[number];
      const box = sheet.cards[slot];
      if (!card || !box) continue;
      drawBingoCard(c, s, card, {
        x: r.x + box.x * pxPerCm,
        y: r.y + box.y * pxPerCm,
        w: box.w * pxPerCm,
        h: box.h * pxPerCm,
      }, pxPerCm, number + 1, guides, cards.length);
    }
  } else if (s.callListOn) {
    drawBingoCallList(c, s, r, pxPerCm);
  }

  // The same small footer line on screen and in the print, so the free sheet always credits back.
  c.fillStyle = "#8a9098";
  c.font = "500 " + Math.max(4, pxPerCm * 0.26) + "px " + BINGO_FONT;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  c.fillText("Bingo cards - free at Tiny County Makers", r.x + r.w / 2, r.y + r.h - sheet.marginCm * pxPerCm * 0.4);
  c.restore();
}

/** One card inside its slot: a title band, the square grid and a small card number. */
function drawBingoCard(c, s, grid, box, pxPerCm, number, guides, total) {
  const cells = Math.max(1, grid.length);
  const headerPx = s.sheet.headerCm * pxPerCm;
  const footerPx = s.sheet.footerCm * pxPerCm;
  const gridPx = s.sheet.gridCm * pxPerCm;
  const cellPx = gridPx / cells;
  const gridX = box.x + (box.w - gridPx) / 2;
  const gridY = box.y + headerPx + Math.max(0, (box.h - headerPx - footerPx - gridPx) * 0.5);
  const free = bingoFreeCell(cells, s.free);

  c.save();
  // The card stock, so each card reads as a separate thing once the sheet is cut up.
  c.fillStyle = "#ffffff";
  c.fillRect(box.x, box.y, box.w, box.h);
  c.strokeStyle = BINGO_RULE;
  c.lineWidth = Math.max(1, pxPerCm * 0.035);
  c.strokeRect(box.x + c.lineWidth / 2, box.y + c.lineWidth / 2, box.w - c.lineWidth, box.h - c.lineWidth);
  if (guides) {
    // A dashed cut line on screen only, so the visitor can see where the scissors go.
    c.save();
    c.setLineDash([Math.max(3, pxPerCm * 0.12), Math.max(2, pxPerCm * 0.09)]);
    c.strokeStyle = "#c9cfd6";
    c.lineWidth = Math.max(0.8, pxPerCm * 0.02);
    c.strokeRect(box.x - pxPerCm * 0.08, box.y - pxPerCm * 0.08, box.w + pxPerCm * 0.16, box.h + pxPerCm * 0.16);
    c.restore();
  }

  // The title band, which carries either the visitor's title or the classic B/I/N/G/O heads.
  c.fillStyle = BINGO_HEAD_FILL;
  c.fillRect(box.x, box.y, box.w, headerPx);
  c.fillStyle = "#ffffff";
  c.textAlign = "center";
  c.textBaseline = "middle";
  const title = (s.title || "").trim();
  if (title) {
    c.font = "700 " + Math.max(6, Math.min(headerPx * 0.5, box.w * 0.1)) + "px " + BINGO_FONT;
    c.fillText(title, box.x + box.w / 2, box.y + headerPx * 0.54, box.w * 0.92);
  } else if (s.modeId === "numbers" && cells === 5) {
    c.font = "800 " + Math.max(6, headerPx * 0.62) + "px " + BINGO_FONT;
    for (let col = 0; col < cells; col += 1) {
      c.fillText(BINGO_COLUMNS[col], gridX + col * cellPx + cellPx / 2, box.y + headerPx * 0.54);
    }
  } else {
    c.font = "800 " + Math.max(6, headerPx * 0.56) + "px " + BINGO_FONT;
    c.fillText("BINGO", box.x + box.w / 2, box.y + headerPx * 0.54, box.w * 0.9);
  }

  // The square grid the players mark off.
  c.strokeStyle = BINGO_RULE;
  c.lineWidth = Math.max(0.6, cellPx * 0.03);
  c.beginPath();
  for (let i = 0; i <= cells; i += 1) {
    const gx = gridX + i * cellPx;
    const gy = gridY + i * cellPx;
    c.moveTo(gx, gridY);
    c.lineTo(gx, gridY + gridPx);
    c.moveTo(gridX, gy);
    c.lineTo(gridX + gridPx, gy);
  }
  c.stroke();
  c.strokeStyle = "#7b838c";
  c.lineWidth = Math.max(0.8, cellPx * 0.045);
  c.strokeRect(gridX, gridY, gridPx, gridPx);

  // The entries, with the free square filled so it reads before a single word is marked.
  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      const text = grid[row][col];
      if (!text) continue;
      const cx = gridX + col * cellPx + cellPx / 2;
      const cy = gridY + row * cellPx + cellPx / 2;
      c.fillStyle = BINGO_INK;
      if (free && free.row === row && free.col === col) {
        const pad = Math.max(0.6, cellPx * 0.03);
        c.fillStyle = BINGO_FREE_FILL;
        c.fillRect(gridX + col * cellPx + pad, gridY + row * cellPx + pad, cellPx - pad * 2, cellPx - pad * 2);
        c.fillStyle = BINGO_INK;
      }
      const label = bingoEntry(text, s.caseId);
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = "700 " + bingoFitFont(c, label, cellPx) + "px " + BINGO_FONT;
      c.fillText(label, cx, cy + cellPx * 0.02, cellPx * 0.92);
    }
  }

  // The card number, which is how a caller and a player agree on which card is which.
  c.fillStyle = "#8a9098";
  c.font = "500 " + Math.max(4, Math.min(footerPx * 0.62, box.w * 0.055)) + "px " + BINGO_FONT;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  c.fillText("Card " + number + " of " + total, box.x + box.w / 2, box.y + box.h - footerPx * 0.28);
  c.restore();
}

/** Shrink a long entry until it fits the square it was dealt, so a word card stays readable. */
function bingoFitFont(c, text, cellPx) {
  let fontPx = Math.max(4, cellPx * 0.42);
  const max = cellPx * 0.9;
  c.font = "700 " + fontPx + "px " + BINGO_FONT;
  while (fontPx > 3 && c.measureText(text).width > max) {
    fontPx -= Math.max(0.4, fontPx * 0.06);
    c.font = "700 " + fontPx + "px " + BINGO_FONT;
  }
  return fontPx;
}

/** The caller's page: the shuffled 1 to 75 numbers, or the word list, in as many columns as fit. */
function drawBingoCallList(c, s, r, pxPerCm) {
  const list = Array.isArray(s.callList) ? s.callList : [];
  const columns = bingoCallColumns(list.length);
  const rows = Math.max(1, Math.ceil(list.length / columns));
  const top = r.y + pxPerCm * 2.3;
  const usableH = Math.max(pxPerCm, r.h - (top - r.y) - pxPerCm * 1.5);
  const usableW = Math.max(pxPerCm, r.w - pxPerCm * 2.4);
  const colW = usableW / columns;
  const rowH = Math.min(usableH / rows, pxPerCm * 0.95);
  const fontPx = Math.max(4, Math.min(rowH * 0.6, colW * 0.4));

  c.save();
  c.fillStyle = BINGO_INK;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = "800 " + Math.max(8, pxPerCm * 0.85) + "px " + BINGO_FONT;
  c.fillText(s.modeId === "numbers" ? "Bingo caller list" : "Bingo word list", r.x + r.w / 2, r.y + pxPerCm * 1.25, r.w - pxPerCm * 2);

  c.font = "600 " + fontPx + "px " + BINGO_FONT;
  list.forEach((entry, index) => {
    const column = Math.floor(index / rows);
    const row = index % rows;
    const x = r.x + pxPerCm * 1.2 + column * colW + colW / 2;
    const y = top + (row + 0.5) * rowH;
    const raw = String(entry);
    const label = s.modeId === "numbers" && /^[0-9]+$/.test(raw)
      ? BINGO_COLUMNS[Math.min(BINGO_COLUMNS.length - 1, Math.floor((Number(raw) - 1) / 15))] + " " + raw
      : bingoEntry(raw, s.caseId);
    c.fillText(label, x, y, colW * 0.92);
  });
  c.restore();
}
function chartFitText(c, text, maxWidth, fontPx, weight) {
  const start = Math.max(5, fontPx);
  const label = String(text || "");
  c.font = weight + " " + start + "px " + CHART_FONT;
  let size = start;
  while (size > 5 && c.measureText(label).width > maxWidth) {
    size -= Math.max(0.25, size * 0.045);
    c.font = weight + " " + size + "px " + CHART_FONT;
  }
  return size;
}

function chartStarPath(c, cx, cy, radius) {
  c.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const distance = i % 2 === 0 ? radius : radius * 0.45;
    const x = cx + Math.cos(angle) * distance;
    const y = cy + Math.sin(angle) * distance;
    if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  c.closePath();
}

function chartTick(c, cx, cy, size) {
  c.beginPath();
  c.moveTo(cx - size * 0.62, cy + size * 0.02);
  c.lineTo(cx - size * 0.16, cy + size * 0.48);
  c.lineTo(cx + size * 0.72, cy - size * 0.54);
  c.stroke();
}

function drawChoreChart(c, s, guides) {
  const r = s.rect;
  const sheet = s.sheet;
  const paper = s.paper;
  const theme = chartTheme(s.themeId);
  const days = Array.isArray(s.days?.names) ? s.days.names : [];
  const rows = sheet.rows;
  const chores = Array.isArray(s.chores) ? s.chores : [];
  const pxPerCm = r.w / paper.widthCm;
  const margin = sheet.marginCm * pxPerCm;
  const x = r.x + margin;
  const y = r.y + margin;
  const w = r.w - margin * 2;
  const h = r.h - margin * 2;
  const titleH = sheet.titleCm * pxPerCm;
  const headH = sheet.headCm * pxPerCm;
  const rewardH = sheet.rewardCm * pxPerCm;
  const gap = sheet.gapCm * pxPerCm;
  const bodyY = y + titleH + headH + gap;
  const bodyW = w;
  const labelW = sheet.labelW * pxPerCm;
  const colW = sheet.colW * pxPerCm;
  const rowH = sheet.rowCm * pxPerCm;
  const tableW = labelW + colW * days.length;
  const lineW = Math.max(0.7, pxPerCm * 0.035);
  const markSize = Math.min(colW * 0.25, rowH * 0.25);

  c.save();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  c.strokeStyle = theme.band;
  c.lineWidth = Math.max(0.8, pxPerCm * 0.05);
  c.strokeRect(x, y, w, h);

  // The title band carries the chart name and the child's name so a finished sheet is identifiable.
  c.fillStyle = theme.head;
  c.fillRect(x, y, w, titleH);
  const nameW = s.name ? Math.min(w * 0.32, pxPerCm * 5.2) : 0;
  const title = s.title || "My Chore Chart";
  const titlePx = chartFitText(c, title, w - nameW - pxPerCm * 0.8, Math.min(titleH * 0.52, pxPerCm * 1.0), "800");
  c.fillStyle = "#ffffff";
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.font = "800 " + titlePx + "px " + CHART_FONT;
  c.fillText(title, x + pxPerCm * 0.35, y + titleH * 0.54, w - nameW - pxPerCm * 0.8);
  if (s.name) {
    c.textAlign = "right";
    c.font = "600 " + Math.max(6, Math.min(titleH * 0.36, pxPerCm * 0.58)) + "px " + CHART_FONT;
    c.fillText(s.name, x + w - pxPerCm * 0.35, y + titleH * 0.54, nameW - pxPerCm * 0.2);
  }

  // The weekday header is deliberately short: every label is read from a metre away on a fridge.
  const headY = y + titleH;
  c.fillStyle = theme.band;
  c.fillRect(x, headY, w, headH);
  c.fillStyle = theme.head;
  c.font = "800 " + Math.max(6, Math.min(headH * 0.46, pxPerCm * 0.52)) + "px " + CHART_FONT;
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.fillText("CHORE", x + pxPerCm * 0.25, headY + headH * 0.54, labelW - pxPerCm * 0.5);
  c.textAlign = "center";
  days.forEach((day, index) => {
    const cellX = x + labelW + index * colW;
    c.fillText(day, cellX + colW / 2, headY + headH * 0.54, colW * 0.92);
  });

  // One row per job, alternating a very light tint so the chart is easy to scan down the page.
  for (let row = 0; row < rows; row += 1) {
    const rowY = bodyY + row * rowH;
    c.fillStyle = row % 2 === 0 ? "#ffffff" : theme.row;
    c.fillRect(x, rowY, bodyW, rowH);
    c.fillStyle = theme.band;
    c.globalAlpha = 0.56;
    c.fillRect(x, rowY, labelW, rowH);
    c.globalAlpha = 1;

    const chore = chores[row] || "";
    const chorePx = chartFitText(c, chore, labelW - pxPerCm * 0.5, Math.min(rowH * 0.46, pxPerCm * 0.5), "600");
    c.fillStyle = theme.head;
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.font = "600 " + chorePx + "px " + CHART_FONT;
    c.fillText(chore, x + pxPerCm * 0.25, rowY + rowH * 0.54, labelW - pxPerCm * 0.5);

    for (let col = 0; col < days.length; col += 1) {
      const cellX = x + labelW + col * colW;
      c.strokeStyle = theme.accent;
      c.lineWidth = lineW;
      c.strokeRect(cellX, rowY, colW, rowH);
      if (s.styleId === "tick") {
        c.globalAlpha = 0.42;
        chartTick(c, cellX + colW / 2, rowY + rowH / 2, markSize);
        c.globalAlpha = 1;
      } else if (s.styleId === "star") {
        c.globalAlpha = 0.38;
        chartStarPath(c, cellX + colW / 2, rowY + rowH / 2, markSize);
        c.stroke();
        c.globalAlpha = 1;
      }
    }
  }

  c.strokeStyle = theme.accent;
  c.lineWidth = lineW;
  c.strokeRect(x, bodyY, tableW, rows * rowH);
  c.beginPath();
  for (let row = 0; row <= rows; row += 1) {
    const lineY = bodyY + row * rowH;
    c.moveTo(x, lineY);
    c.lineTo(x + tableW, lineY);
  }
  for (let col = 0; col <= days.length; col += 1) {
    const lineX = x + labelW + col * colW;
    c.moveTo(lineX, bodyY);
    c.lineTo(lineX, bodyY + rows * rowH);
  }
  c.stroke();

  // The reward line is the point of the chart, so it never gets lost among the check boxes.
  const rewardY = bodyY + rows * rowH;
  c.fillStyle = theme.band;
  c.fillRect(x, rewardY, tableW, rewardH);
  c.fillStyle = theme.head;
  c.font = "800 " + Math.max(6, Math.min(rewardH * 0.38, pxPerCm * 0.5)) + "px " + CHART_FONT;
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.fillText("REWARD", x + pxPerCm * 0.3, rewardY + rewardH * 0.54, labelW - pxPerCm * 0.6);
  const reward = s.reward || "Choose a reward";
  const rewardPx = chartFitText(c, reward, tableW - labelW - pxPerCm * 0.6, Math.min(rewardH * 0.42, pxPerCm * 0.56), "700");
  c.fillStyle = theme.accent;
  c.font = "700 " + rewardPx + "px " + CHART_FONT;
  c.fillText(reward, x + labelW + pxPerCm * 0.3, rewardY + rewardH * 0.54, tableW - labelW - pxPerCm * 0.6);
  c.restore();

  if (guides) {
    c.save();
    c.strokeStyle = "rgba(0,0,0,.28)";
    c.lineWidth = 1;
    c.strokeRect(r.x, r.y, r.w, r.h);
    c.restore();
  }
}
function mulFitText(c, text, maxWidth, fontPx, weight) {
  const start = Math.max(5, fontPx);
  const label = String(text == null ? "" : text);
  c.font = weight + " " + start + "px " + CHART_FONT;
  let size = start;
  while (size > 5 && c.measureText(label).width > maxWidth) {
    size -= Math.max(0.25, size * 0.045);
    c.font = weight + " " + size + "px " + CHART_FONT;
  }
  return size;
}

/** The grid half of the multiplication chart: factor headers, products, and the square diagonal. */
function drawMulGrid(c, s, theme, x, bodyY, w, bodyH, pxPerCm, lineW) {
  const max = s.sheet.max;
  const cols = s.sheet.cols;
  const rows = s.sheet.rows;
  const cw = w / cols;
  const ch = bodyH / rows;
  const cellPx = Math.min(cw, ch);
  const headPx = Math.min(cellPx * 0.46, ch * 0.56, pxPerCm * 0.62);
  const bodyPx = Math.min(cellPx * 0.42, ch * 0.52, pxPerCm * 0.56);

  // The header row and header column carry the two factors; the body carries the products.
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = x + col * cw;
      const cy = bodyY + row * ch;
      const isHead = row === 0 || col === 0;
      const square = s.squaresId === "on" && row > 0 && row === col;
      c.fillStyle = isHead ? theme.band : square ? theme.row : "#ffffff";
      c.fillRect(cx, cy, cw, ch);
    }
  }

  c.strokeStyle = theme.accent;
  c.lineWidth = lineW;
  c.beginPath();
  for (let row = 0; row <= rows; row += 1) {
    const ly = bodyY + row * ch;
    c.moveTo(x, ly);
    c.lineTo(x + w, ly);
  }
  for (let col = 0; col <= cols; col += 1) {
    const lx = x + col * cw;
    c.moveTo(lx, bodyY);
    c.lineTo(lx, bodyY + bodyH);
  }
  c.stroke();
  c.strokeRect(x, bodyY, w, bodyH);

  // The corner stays empty and the two edges run 1..max, so the table reads like a printed chart.
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillStyle = theme.head;
  c.font = "800 " + headPx + "px " + CHART_FONT;
  for (let col = 1; col < cols; col += 1) {
    c.fillText(String(col), x + col * cw + cw / 2, bodyY + ch / 2, cw * 0.9);
  }
  for (let row = 1; row < rows; row += 1) {
    c.fillText(String(row), x + cw / 2, bodyY + row * ch + ch / 2, cw * 0.9);
  }

  // mulShowsAnswer decides how much of the answer key is printed, so one sheet is both a chart
  // and the practice copy that goes with it.
  c.fillStyle = theme.accent;
  c.font = "600 " + bodyPx + "px " + CHART_FONT;
  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      if (!mulShowsAnswer(s.fillId, row, col, max)) continue;
      c.fillText(String(row * col), x + col * cw + cw / 2, bodyY + row * ch + ch / 2, cw * 0.9);
    }
  }
}

/** The written-out half of the multiplication chart: one block per times table. */
function drawMulTables(c, s, theme, x, bodyY, w, bodyH, pxPerCm, lineW) {
  const sheet = s.sheet;
  const max = sheet.max;
  const bw = w / sheet.blockCols;
  const bh = bodyH / sheet.blockRows;
  const lineH = bh / (max + 1);
  const padX = Math.max(2, bw * 0.045);
  const headPx = Math.min(lineH * 0.5, pxPerCm * 0.5);
  const bodyPx = Math.min(lineH * 0.44, pxPerCm * 0.42);

  for (let t = 0; t < max; t += 1) {
    const table = t + 1;
    const bx = x + (t % sheet.blockCols) * bw;
    const by = bodyY + Math.floor(t / sheet.blockCols) * bh;
    c.save();
    c.beginPath();
    c.rect(bx, by, bw, bh);
    c.clip();

    // The heading names the table, then every fact is written out on its own line.
    c.fillStyle = theme.band;
    c.fillRect(bx, by, bw, lineH);
    c.fillStyle = theme.head;
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.font = "800 " + headPx + "px " + CHART_FONT;
    c.fillText(table + " times table", bx + padX, by + lineH * 0.56, bw - padX * 2);

    c.font = "600 " + bodyPx + "px " + CHART_FONT;
    for (let k = 1; k <= max; k += 1) {
      const ly = by + k * lineH;
      if (k % 2 === 1) {
        c.fillStyle = theme.row;
        c.fillRect(bx, ly, bw, lineH);
      }
      c.fillStyle = theme.accent;
      const shown = mulShowsAnswer(s.fillId, table, k, max);
      c.fillText(table + " x " + k + " = " + (shown ? String(table * k) : "____"), bx + padX, ly + lineH * 0.56, bw - padX * 2);
    }

    c.strokeStyle = theme.accent;
    c.lineWidth = lineW;
    c.strokeRect(bx, by, bw, bh);
    c.restore();
  }
}

/**
 * A printable multiplication chart. One recipe draws the grid and the written-out tables, on
 * either paper, in either orientation, so the preview and the 300 DPI download always agree.
 */
function drawMultiplicationChart(c, s, guides) {
  const r = s.rect;
  const sheet = s.sheet;
  const theme = chartTheme(s.themeId);
  const pxPerCm = r.w / sheet.widthCm;
  const margin = sheet.marginCm * pxPerCm;
  const x = r.x + margin;
  const y = r.y + margin;
  const w = r.w - margin * 2;
  const h = r.h - margin * 2;
  const titleH = sheet.titleCm * pxPerCm;
  const gap = sheet.gapCm * pxPerCm;
  const bodyY = y + titleH + gap;
  const bodyH = h - titleH - gap;
  const lineW = Math.max(0.7, pxPerCm * 0.035);

  c.save();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  c.strokeStyle = theme.band;
  c.lineWidth = Math.max(0.8, pxPerCm * 0.05);
  c.strokeRect(x, y, w, h);

  // The title band names the chart and the child it belongs to, so a finished sheet is identifiable.
  c.fillStyle = theme.head;
  c.fillRect(x, y, w, titleH);
  const nameW = s.name ? Math.min(w * 0.3, pxPerCm * 5.2) : 0;
  const title = s.title || "Multiplication chart";
  const titlePx = mulFitText(c, title, w - nameW - pxPerCm * 0.8, Math.min(titleH * 0.5, pxPerCm * 0.95), "800");
  c.fillStyle = "#ffffff";
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.font = "800 " + titlePx + "px " + CHART_FONT;
  c.fillText(title, x + pxPerCm * 0.35, y + titleH * 0.54, w - nameW - pxPerCm * 0.8);
  if (s.name) {
    c.textAlign = "right";
    c.font = "600 " + Math.max(6, Math.min(titleH * 0.34, pxPerCm * 0.56)) + "px " + CHART_FONT;
    c.fillText(s.name, x + w - pxPerCm * 0.35, y + titleH * 0.54, nameW - pxPerCm * 0.2);
  }

  if (s.type === "tables") drawMulTables(c, s, theme, x, bodyY, w, bodyH, pxPerCm, lineW);
  else drawMulGrid(c, s, theme, x, bodyY, w, bodyH, pxPerCm, lineW);

  c.restore();

  if (guides) {
    c.save();
    c.strokeStyle = "rgba(0,0,0,.28)";
    c.lineWidth = 1;
    c.strokeRect(r.x, r.y, r.w, r.h);
    c.restore();
  }
}
function crownFitText(c, text, maxWidth, fontPx, weight) {
  const label = String(text == null ? "" : text);
  let size = Math.max(5, fontPx);
  c.font = weight + " " + size + "px " + CHART_FONT;
  while (size > 5 && c.measureText(label).width > maxWidth) {
    size -= Math.max(0.25, size * 0.045);
    c.font = weight + " " + size + "px " + CHART_FONT;
  }
  return size;
}

/**
 * One point of a crown, appended to a path that is already open at the point left edge. Every
 * style is written as a single closed shape so the whole band can be filled in one pass and the
 * neighbouring points never show a seam where two fills meet.
 */
function crownPoint(c, style, x, baseY, tw, th) {
  const cx = x + tw / 2;
  const top = baseY - th;
  if (style === "birthday") {
    // A scalloped edge: a half round sits on the band and the next one starts where it ends.
    c.ellipse(cx, baseY, tw / 2, th, 0, Math.PI, 0);
    return;
  }
  if (style === "queen") {
    // A rounded arch, so the crown reads as soft rather than spiky.
    c.bezierCurveTo(x + tw * 0.16, top - th * 0.1, x + tw * 0.84, top - th * 0.1, x + tw, baseY);
    return;
  }
  if (style === "princess") {
    // Two lobes meeting at a point on the band, which is the heart a princess crown is cut from.
    c.bezierCurveTo(x - tw * 0.04, baseY - th * 0.7, x + tw * 0.16, top - th * 0.08, cx, top + th * 0.3);
    c.bezierCurveTo(x + tw * 0.84, top - th * 0.08, x + tw * 1.04, baseY - th * 0.7, x + tw, baseY);
    return;
  }
  if (style === "king") {
    // A sharp five sided point, the silhouette people picture when they think of a crown.
    c.lineTo(x, baseY - th * 0.4);
    c.lineTo(cx, top);
    c.lineTo(x + tw, baseY - th * 0.4);
    c.lineTo(x + tw, baseY);
    return;
  }
  // Plain keeps the simplest cut: one straight triangle per point.
  c.lineTo(cx, top);
  c.lineTo(x + tw, baseY);
}

/**
 * A printable paper crown. Two bands share one landscape sheet, each one an outline of points on
 * top of a band with a glue tab at the end, so a single download is a crown that can be cut out
 * and worn. One recipe draws the preview and the 300 DPI sheet, so the two always agree.
 */
function drawCrown(c, s, guides) {
  const r = s.rect;
  const sheet = s.sheet;
  const theme = chartTheme(s.themeId);
  const pxPerCm = r.w / sheet.widthCm;
  const x0 = r.x + sheet.marginCm * pxPerCm;
  const y0 = r.y + sheet.marginCm * pxPerCm;
  const bodyW = sheet.bodyWCm * pxPerCm;
  const tabW = sheet.tabCm * pxPerCm;
  const bodyH = sheet.bodyCm * pxPerCm;
  const teethH = sheet.teethCm * pxPerCm;
  const tw = sheet.toothWCm * pxPerCm;
  const lineW = Math.max(0.7, pxPerCm * 0.035);

  c.save();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);

  for (let b = 0; b < sheet.perSheet; b += 1) {
    const top = y0 + (sheet.topCm + b * (sheet.bandHCm + sheet.gapCm)) * pxPerCm;
    const baseY = top + teethH;
    const bottom = baseY + bodyH;

    // The points and the band are one closed outline, so the fill has no seam between neighbours.
    c.save();
    c.beginPath();
    c.moveTo(x0, baseY);
    for (let i = 0; i < sheet.teeth; i += 1) crownPoint(c, s.styleId, x0 + i * tw, baseY, tw, teethH);
    c.lineTo(x0 + bodyW, bottom);
    c.lineTo(x0, bottom);
    c.closePath();
    c.fillStyle = theme.head;
    c.fill();
    c.restore();

    // An accent edge where the points meet the band, and a second one along the bottom.
    c.save();
    c.strokeStyle = theme.accent;
    c.lineWidth = Math.max(1, pxPerCm * 0.08);
    c.beginPath();
    c.moveTo(x0, baseY);
    c.lineTo(x0 + bodyW, baseY);
    c.stroke();
    c.lineWidth = lineW;
    c.beginPath();
    c.moveTo(x0, bottom);
    c.lineTo(x0 + bodyW, bottom);
    c.stroke();
    c.restore();

    // The name sits on the front of the band, shrunk until it fits between the two ends.
    if (s.name) {
      const maxNameW = bodyW - pxPerCm * 1.4;
      const size = crownFitText(c, s.name, maxNameW, Math.min(bodyH * 0.6, pxPerCm * 1.6), "800");
      c.save();
      c.fillStyle = "#ffffff";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = "800 " + size + "px " + CHART_FONT;
      c.fillText(s.name, x0 + bodyW / 2, baseY + bodyH * 0.56, maxNameW);
      c.restore();
    }

    // The tab tucks behind the next band, so it is left white and marked with a fold line.
    c.save();
    c.fillStyle = "#ffffff";
    c.fillRect(x0 + bodyW, baseY, tabW, bodyH);
    c.strokeStyle = theme.accent;
    c.lineWidth = lineW;
    c.setLineDash([pxPerCm * 0.24, pxPerCm * 0.2]);
    c.strokeRect(x0 + bodyW, baseY, tabW, bodyH);
    c.beginPath();
    c.moveTo(x0 + bodyW + tabW * 0.26, bottom - lineW * 2);
    c.lineTo(x0 + bodyW + tabW * 0.7, baseY + lineW * 2);
    c.moveTo(x0 + bodyW + tabW * 0.48, bottom - lineW * 2);
    c.lineTo(x0 + bodyW + tabW * 0.92, baseY + lineW * 2);
    c.stroke();
    c.setLineDash([]);
    c.restore();
  }

  // The sheet carries its own instructions, because the two bands are cut apart before they are worn.
  const noteY = y0 + (sheet.topCm + sheet.bandHCm + sheet.gapCm / 2) * pxPerCm;
  const noteSize = Math.max(5, Math.min(sheet.gapCm * pxPerCm * 0.44, pxPerCm * 0.44));
  c.save();
  c.fillStyle = theme.accent;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = "600 " + noteSize + "px " + CHART_FONT;
  c.fillText("Cut out both bands on the solid line. Overlap the tab behind the end of the other band, then glue or tape it.", r.x + r.w / 2, noteY, r.w - sheet.marginCm * pxPerCm * 2);
  c.restore();

  c.restore();

  if (guides) {
    c.save();
    c.strokeStyle = "rgba(0,0,0,.28)";
    c.lineWidth = 1;
    c.strokeRect(r.x, r.y, r.w, r.h);
    c.restore();
  }
}
function sceneBox() {
  if (scene.kind === "sticker" || scene.kind === "sticker-outline") {
    const b = boundsOfContours(scene.outline) || boundsOfContours(scene.base);
    if (!b) return null;
    const pad = 2;
    return { x: b.minX - pad, y: b.minY - pad, width: b.width + pad * 2, height: b.height + pad * 2 };
  }
  if (scene.kind === "photo-keychain") {
    const o = scene.outer;
    const pad = 2;
    return { x: o.x - pad, y: o.y - pad, width: o.w + pad * 2, height: o.h + pad * 2 };
  }
  if (scene.kind === "name-keychain") {
    // The name artwork already contains its own hanging tab and drill hole, so the export
    // canvas is exactly the finished piece: 300 DPI long side with no hidden padding.
    const r = scene.rect;
    return { x: r.x, y: r.y, width: r.w, height: r.h };
  }
  if (scene.kind === "cake-topper") {
    // The traced letters decide the export box, so the empty artboard around them is dropped.
    const b = boundsOfContours(scene.outline);
    if (!b) return null;
    const pad = 2;
    return { x: b.minX - pad, y: b.minY - pad, width: b.width + pad * 2, height: b.height + pad * 2 };
  }
  if (scene.kind === "coaster" || scene.kind === "name-plate" || scene.kind === "jigsaw" || scene.kind === "ornament" || scene.kind === "luggage-tag" || scene.kind === "bookmark" || scene.kind === "photo-strip" || scene.kind === "table-number" || scene.kind === "place-card" || scene.kind === "polaroid" || scene.kind === "cupcake" || scene.kind === "coloring" || scene.kind === "gift-tag" || scene.kind === "name-tracing" || scene.kind === "word-search" || scene.kind === "bingo" || scene.kind === "chore-chart" || scene.kind === "multiplication-chart" || scene.kind === "crown-maker") {
    // The silhouette fills its box exactly, so the export canvas is the finished piece.
    const r = scene.rect;
    return { x: r.x, y: r.y, width: r.w, height: r.h };
  }
  if (scene.kind === "block") {
    // The export is exactly the finished block: no preview shadow, no hidden padding.
    const r = scene.rect;
    return { x: r.x, y: r.y, width: r.w, height: r.h };
  }
  const r = scene.rect;
  if (scene.kind === "magnet") {
    const pad = Math.max(10, Math.min(r.w, r.h) * 0.055) + 2;
    return { x: r.x - pad, y: r.y - pad, width: r.w + pad * 2, height: r.h + pad * 2 };
  }
  const baseH = Math.max(28, r.h * 0.14);
  const top = r.y - 16;
  const bottom = r.y + r.h + 13 + baseH + 16;
  return { x: r.x - 20, y: top, width: r.w + 40, height: bottom - top };
}

function renderScene(scale) {
  if (scene.kind === "coloring") {
    // The page is rebuilt at the export DPI instead of being scaled up, so the printed line
    // weight and the tone boundaries stay exactly what the settings promised.
    const page = coloringPage(scene.page.id, scene.page.orientation, PRINT_DPI);
    const out = coloringPageCanvas(page, scene);
    return { canvas: out, box: { x: 0, y: 0, width: page.widthPx, height: page.heightPx } };
  }
  const box = sceneBox();
  if (!box) return null;
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(box.width * scale));
  out.height = Math.max(1, Math.round(box.height * scale));
  const c = out.getContext("2d");
  c.scale(scale, scale);
  c.translate(-box.x, -box.y);
  if (scene.kind === "sticker") drawSticker(c, scene, false);
  else if (scene.kind === "sticker-outline") drawStickerOutline(c, scene, false);
  else if (scene.kind === "photo-keychain") drawPhotoKeychain(c, scene, false);
  else if (scene.kind === "name-keychain") drawNameKeychain(c, scene, false);
  else if (scene.kind === "coaster") drawCoaster(c, scene, false);
  else if (scene.kind === "name-plate") drawNamePlate(c, scene, false);
  else if (scene.kind === "magnet") drawMagnet(c, scene);
  else if (scene.kind === "ornament") drawOrnament(c, scene, false);
  else if (scene.kind === "luggage-tag") drawLuggageTag(c, scene, false);
  else if (scene.kind === "bookmark") drawBookmark(c, scene, false);
  else if (scene.kind === "cake-topper") drawCakeTopper(c, scene, false);
  else if (scene.kind === "block") drawBlock(c, scene, false);
  else if (scene.kind === "jigsaw") drawJigsaw(c, scene, false);
  else if (scene.kind === "photo-strip") drawPhotoStrip(c, scene, false);
  else if (scene.kind === "table-number") drawTableNumber(c, scene, false);
  else if (scene.kind === "place-card") drawPlaceCardSheet(c, scene, false);
  else if (scene.kind === "polaroid") drawPolaroid(c, scene, false);
  else if (scene.kind === "cupcake") drawCupcake(c, scene, false);
  else if (scene.kind === "gift-tag") drawGiftTag(c, scene, false);
  else if (scene.kind === "name-tracing") drawNameTracing(c, scene, false);
  else if (scene.kind === "word-search") drawWordSearch(c, scene, false);
  else if (scene.kind === "bingo") drawBingo(c, scene, false);
  else if (scene.kind === "chore-chart") drawChoreChart(c, scene, false);
  else if (scene.kind === "multiplication-chart") drawMultiplicationChart(c, scene, false);
  else if (scene.kind === "crown-maker") drawCrown(c, scene, false);
  else drawStandee(c, scene);
  return { canvas: out, box };
}

/**
 * The printable outline of the finished object, in work pixels. It is deliberately not the
 * 620 px artboard: a die-cut star inside a square frame is only as wide as the star.
 */
function pieceBox() {
  if (scene.kind === "sticker" || scene.kind === "sticker-outline") {
    const b = boundsOfContours(scene.outline) || boundsOfContours(scene.base);
    return b ? { width: b.width, height: b.height, x: b.minX, y: b.minY } : { width: WORK_LONG_SIDE, height: WORK_LONG_SIDE, x: 0, y: 0 };
  }
  if (scene.kind === "photo-keychain") {
    const o = scene.outer;
    return { width: o.w, height: o.h, x: o.x, y: o.y };
  }
  if (scene.kind === "name-keychain") {
    const r = scene.rect;
    return { width: r.w, height: r.h, x: r.x, y: r.y };
  }
  if (scene.kind === "cake-topper") {
    const b = boundsOfContours(scene.outline);
    return b ? { width: b.width, height: b.height, x: b.minX, y: b.minY } : { width: WORK_LONG_SIDE, height: WORK_LONG_SIDE, x: 0, y: 0 };
  }
  if (scene.kind === "coaster" || scene.kind === "name-plate" || scene.kind === "jigsaw" || scene.kind === "ornament" || scene.kind === "luggage-tag" || scene.kind === "bookmark" || scene.kind === "photo-strip" || scene.kind === "table-number" || scene.kind === "place-card" || scene.kind === "polaroid" || scene.kind === "cupcake" || scene.kind === "coloring" || scene.kind === "gift-tag" || scene.kind === "name-tracing" || scene.kind === "word-search" || scene.kind === "bingo" || scene.kind === "chore-chart" || scene.kind === "multiplication-chart" || scene.kind === "crown-maker") {
    const r = scene.rect;
    return { width: r.w, height: r.h, x: r.x, y: r.y };
  }
  if (scene.kind === "block") {
    const r = scene.rect;
    return { width: r.w, height: r.h, x: r.x, y: r.y };
  }
  const r = scene.rect;
  if (scene.kind === "magnet") {
    const pad = Math.max(10, Math.min(r.w, r.h) * 0.055);
    return { width: r.w + pad * 2, height: r.h + pad * 2, x: r.x - pad, y: r.y - pad };
  }
  return { width: r.w, height: r.h, x: r.x, y: r.y };
}

/** Scale that puts the finished piece, not the artboard, on the selected physical size. */
function exportScale() {
  const piece = pieceBox();
  return physicalPixels(scene.longSideCm, PRINT_DPI) / Math.max(piece.width, piece.height);
}

/** Download name: photo blocks read as inches, everything else as a long side in cm. */
function exportName(extension) {
  const stem = scene.kind === "coloring" && scene.page
    ? "coloring-page-" + scene.page.id + "-" + scene.page.orientation
    : scene.kind === "name-tracing" && scene.paper
    ? "name-tracing-" + (scene.text ? scene.text.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() : "worksheet") + "-" + scene.paper.id + "-sheet-" + (scene.page + 1)
    : scene.kind === "crown-maker" && scene.paper
    ? "crown-maker-" + scene.paper.id + "-" + scene.styleId + "-" + scene.bandId + "-2-bands"
    : scene.kind === "multiplication-chart" && scene.paper
    ? "multiplication-chart-" + scene.paper.id + "-" + scene.orient + "-1-to-" + scene.max
    : scene.kind === "chore-chart" && scene.paper
    ? "chore-chart-" + scene.paper.id + "-" + scene.days.id + "-sheet-1"
    : scene.kind === "bingo" && scene.paper
    ? "bingo-" + scene.paper.id + "-" + scene.cards.length + "-cards-sheet-" + (scene.page + 1)
    : scene.kind === "word-search" && scene.paper
    ? "word-search-" + (scene.title ? scene.title.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase().slice(0, 40) : "puzzle") + "-" + scene.paper.id + "-" + scene.build.cells + "x" + scene.build.cells
    : scene.kind === "gift-tag" && scene.tag
    ? "gift-tag-" + scene.tag.id + (scene.sheet ? "-" + scene.sheet.id + "-sheet" : "")
    : scene.kind === "cupcake" && scene.topper
    ? "cupcake-topper-" + scene.topper.id + (scene.sheet ? "-" + scene.sheet.id + "-sheet" : "")
    : scene.kind === "polaroid" && scene.frame
    ? "polaroid-" + scene.frame.id + (scene.sheet ? "-" + scene.sheet.id + "-sheet" : "")
    : scene.kind === "table-number" && scene.spec
    ? "table-number-" + scene.spec.id
    : scene.kind === "place-card" && scene.spec
      ? "place-cards-" + scene.spec.id + "-sheet-" + (scene.page + 1)
      : scene.spec
        ? scene.spec.id + "in-" + profile.id
      : scene.kind === "jigsaw" && scene.grid
        ? profile.id + "-" + scene.grid.id + "-" + scene.longSideCm + "cm"
        : profile.id + "-" + scene.longSideCm + "cm";
  return stem + "-" + PRINT_DPI + "dpi." + extension;
}

/**
 * The line-art mask for one coloring sheet, at the sheet's own resolution. Every measurement
 * comes from the destination pixels, so the preview and the 300 DPI download agree on what
 * "balanced" and "medium" actually mean.
 */
function coloringMask(page, s) {
  const w = page.artWidthPx;
  const h = page.artHeightPx;
  const photo = s.photo;
  if (!photo) return new Uint8Array(w * h);
  const art = document.createElement("canvas");
  art.width = w;
  art.height = h;
  const g = art.getContext("2d", { willReadFrequently: true });
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, w, h);
  const sw = photo.naturalWidth || photo.width || 0;
  const sh = photo.naturalHeight || photo.height || 0;
  if (sw > 0 && sh > 0) {
    const fit = fitBox(sw, sh, w, h);
    g.imageSmoothingQuality = "high";
    g.drawImage(photo, 0, 0, sw, sh, fit.x, fit.y, fit.width, fit.height);
  }
  const plane = grayscalePlane(g.getImageData(0, 0, w, h).data, w, h);
  const blur = Math.round(s.detail.blur * Math.max(w, h));
  const smooth = blur > 0 ? boxBlurPlane(plane, w, h, blur) : plane;
  let mask;
  if (s.style.id === "sketch") {
    // A sigma in millimetres keeps the pencil edges the same thickness on screen and on paper.
    const sigma = Math.max(1, Math.round((0.4 / 25.4) * page.dpi));
    const response = differenceOfGaussians(smooth, w, h, sigma, 0.985);
    mask = maskAbove(response, w, h, quantileThreshold(response, 1 - s.detail.ink));
  } else {
    mask = boundaryMask(posterizePlane(smooth, w, h, s.detail.levels), w, h);
  }
  mask = despeckleMask(mask, w, h, 2);
  // A flat or almost flat picture has no seams to draw, and a threshold on a flat response would
  // ink the whole sheet; an empty page is the honest answer instead of a solid block.
  if (maskInkRatio(mask) > 0.45) return new Uint8Array(w * h);
  const radius = lineRadiusPx(s.weight.mm, page.dpi);
  return radius > 0 ? dilateMask(mask, w, h, radius) : mask;
}

/** One finished sheet: paper, blank printer margin and the line art, all at the page's own DPI. */
function coloringPageCanvas(page, s) {
  const mask = coloringMask(page, s);
  const out = document.createElement("canvas");
  out.width = page.widthPx;
  out.height = page.heightPx;
  const g = out.getContext("2d");
  g.fillStyle = s.invert ? COLORING_INK : "#ffffff";
  g.fillRect(0, 0, page.widthPx, page.heightPx);
  const art = g.createImageData(page.artWidthPx, page.artHeightPx);
  const inkRgb = s.invert ? [255, 255, 255] : [20, 20, 20];
  const paperRgb = s.invert ? [20, 20, 20] : [255, 255, 255];
  for (let i = 0; i < mask.length; i++) {
    const p = i * 4;
    const rgb = mask[i] ? inkRgb : paperRgb;
    art.data[p] = rgb[0];
    art.data[p + 1] = rgb[1];
    art.data[p + 2] = rgb[2];
    art.data[p + 3] = 255;
  }
  g.putImageData(art, page.marginPx, page.marginPx);
  s.inkRatio = maskInkRatio(mask);
  return out;
}

/** The sheet on the preview canvas, with a soft shadow so it reads as a real page of paper. */
function drawColoringPage(c, s, guides) {
  const r = s.rect;
  if (guides) {
    c.save();
    c.shadowColor = "rgba(20,26,23,.2)";
    c.shadowBlur = 26;
    c.shadowOffsetY = 12;
    c.fillStyle = s.invert ? COLORING_INK : "#ffffff";
    c.fillRect(r.x, r.y, r.w, r.h);
    c.restore();
  }
  if (s.canvas) c.drawImage(s.canvas, r.x, r.y, r.w, r.h);
  if (guides) {
    c.save();
    c.strokeStyle = "rgba(20,26,23,.14)";
    c.lineWidth = 1;
    c.strokeRect(r.x + 0.5, r.y + 0.5, Math.max(1, r.w - 1), Math.max(1, r.h - 1));
    c.restore();
  }
}

/**
 * Coloring pages are the one product that is rebuilt for the download rather than scaled up:
 * a mask traced at preview resolution would print as a fat, ragged line, so the whole sheet is
 * redrawn at 300 DPI with the same settings.
 */
function exportColoringPng() {
  note("Drawing your " + scene.page.short + " page at 300 DPI - this can take a few seconds...");
  requestAnimationFrame(() => setTimeout(() => {
    if (scene.kind !== "coloring") return;
    const page = coloringPage(scene.page.id, scene.page.orientation, PRINT_DPI);
    const out = coloringPageCanvas(page, scene);
    download(out.toDataURL("image/png"), exportName("png"));
    track("design_downloaded", { format: "png", dpi: PRINT_DPI, longSideCm: scene.longSideCm, paper: page.id, orientation: page.orientation });
    note(scene.photo
      ? "Your " + page.short + " " + page.orientation + " coloring page is ready - a " + page.widthPx + " x " + page.heightPx + " px PNG at " + PRINT_DPI + " DPI."
      : "Your blank " + page.short + " " + page.orientation + " sheet is ready - upload a photo to fill it with line art.");
  }, 0));
}

function exportPng() {
  if (scene.kind === "coloring") return exportColoringPng();
  const rendered = renderScene(exportScale());
  if (!rendered) return note("Upload an image with visible artwork first.");
  const name = exportName("png");
  download(rendered.canvas.toDataURL("image/png"), name);
  track("design_downloaded", { format: "png", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

function exportSvg() {
  if (scene.kind === "cake-topper") return exportTopperSvg();
  if (scene.kind === "coaster") return exportCoasterSvg();
  if (scene.kind === "name-plate") return exportNamePlateSvg();
  if (scene.kind === "jigsaw") return exportJigsawSvg();
  if (scene.kind === "sticker-outline") return exportStickerOutlineSvg();
  if (scene.kind === "ornament" || scene.kind === "luggage-tag" || scene.kind === "bookmark") return exportOrnamentSvg();
  if (scene.kind !== "sticker") return;
  const scale = exportScale();
  const box = sceneBox();
  if (!box || !scene.base.length) return note("Upload an image with visible artwork first.");
  const tx = (points) => points.map(([x, y]) => [(x - box.x) * scale, (y - box.y) * scale]);
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const r = scene.rect;
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  art.getContext("2d").drawImage(scene.image, 0, 0, art.width, art.height);
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.longSideCm} cm long side, ${PRINT_DPI} DPI</title>`,
    `<g id="Sticker">`,
    `<path id="WhiteBorder" d="${contoursToPathD(scene.outline.map(tx), 2)}" fill="#ffffff" fill-rule="evenodd"/>`,
    `<image id="Artwork" x="${(r.x - box.x) * scale}" y="${(r.y - box.y) * scale}" width="${art.width}" height="${art.height}" href="${art.toDataURL("image/png")}"/>`,
    `<path id="Cutline" d="${contoursToPathD(scene.base.map(tx), 2)}" fill="none" stroke="#ff00ff" stroke-width="1" stroke-dasharray="6 4"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), `${profile.id}-${scene.longSideCm}cm-${PRINT_DPI}dpi.svg`, "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

/**
 * Border layer plus the artwork, drawn in the same order the canvas uses. The extra hairline
 * edge marks where the artwork stops and the border starts, which is handy when the sticker is
 * placed on a light page and a white border would otherwise be invisible.
 */
function exportStickerOutlineSvg() {
  const scale = exportScale();
  const box = sceneBox();
  if (!box || !scene.base.length) return note("Upload an image with visible artwork first.");
  const tx = (points) => points.map(([x, y]) => [(x - box.x) * scale, (y - box.y) * scale]);
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const r = scene.rect;
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  art.getContext("2d").drawImage(scene.image, 0, 0, art.width, art.height);
  const lines = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + " " + height + '" role="img">',
    "<title>" + profile.product + " - " + scene.borderMm + " mm border, " + scene.longSideCm + " cm long side, " + PRINT_DPI + " DPI</title>",
    '<g id="StickerOutline">',
    '<path id="Border" d="' + contoursToPathD(scene.outline.map(tx), 2) + '" fill="' + scene.border + '" fill-rule="evenodd"/>',
    '<image id="Artwork" x="' + (r.x - box.x) * scale + '" y="' + (r.y - box.y) * scale + '" width="' + art.width + '" height="' + art.height + '" href="' + art.toDataURL("image/png") + '"/>',
    '<path id="Edge" d="' + contoursToPathD(scene.base.map(tx), 2) + '" fill="none" stroke="rgba(0,0,0,.10)" stroke-width="1"/>',
    "</g>",
    "</svg>",
  ];
  downloadBlob(lines.join("\n"), exportName("svg"), "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

/**
 * A five-petal bloom on a transparent background: solid, clean-edged shapes that trace into a
 * tidy silhouette, so the border is the first thing a visitor sees before they upload anything.
 */
function stickerOutlineSampleArtwork() {
  const c = document.createElement("canvas");
  c.width = 880;
  c.height = 880;
  const x = c.getContext("2d");
  x.translate(440, 430);
  const leaf = (angle, length, wide) => {
    x.save();
    x.rotate(angle);
    x.beginPath();
    x.moveTo(0, 30);
    x.quadraticCurveTo(wide, -length * 0.4, 0, -length);
    x.quadraticCurveTo(-wide, -length * 0.4, 0, 30);
    x.closePath();
    x.fillStyle = "#5f9463";
    x.fill();
    x.restore();
  };
  leaf(0.42, 300, 104);
  leaf(-0.42, 300, 104);
  for (let i = 0; i < 5; i++) {
    x.save();
    x.rotate((i / 5) * Math.PI * 2);
    x.beginPath();
    x.ellipse(0, -168, 106, 162, 0, 0, Math.PI * 2);
    x.fillStyle = i % 2 ? "#f2a0bd" : "#ec7ba3";
    x.fill();
    x.restore();
  }
  x.beginPath();
  x.arc(0, 0, 92, 0, Math.PI * 2);
  x.fillStyle = "#f6c351";
  x.fill();
  x.beginPath();
  x.arc(0, 0, 92, 0, Math.PI * 2);
  x.strokeStyle = "rgba(180,124,20,.35)";
  x.lineWidth = 6;
  x.stroke();
  return c;
}

/** Cut path plus a printable artwork layer, the same split the sticker tool ships. */
function exportOrnamentSvg() {
  const scale = exportScale();
  const box = sceneBox();
  const r = scene.rect;
  if (!box) return note("Add a photo before exporting.");
  const tx = ([x, y]) => [(x - box.x) * scale, (y - box.y) * scale];
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const shape = contoursToPathD([scene.outline.map(tx)], 2);
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  const ax = art.getContext("2d");
  ax.fillStyle = "#ffffff";
  ax.fillRect(0, 0, art.width, art.height);
  drawCover(ax, scene.image, 0, 0, art.width, art.height);
  const localOutline = scene.outline.map(([px, py]) => [(px - box.x) * scale, (py - box.y) * scale]);
  if (scene.kind === "bookmark") drawBookmarkText(ax, scene.lines, 0, 0, art.width, art.height, scene.shape);
  else if (scene.kind === "luggage-tag") drawTagText(ax, scene.lines, 0, 0, art.width, art.height);
  else drawOrnamentEngraving(ax, scene.text, 0, 0, art.width, art.height, localOutline);
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.longSideCm} cm long side, ${PRINT_DPI} DPI</title>`,
    `<defs><clipPath id="OrnamentShape"><path d="${shape}"/></clipPath></defs>`,
    `<g id="Artwork" clip-path="url(#OrnamentShape)">`,
    `<image x="0" y="0" width="${width}" height="${height}" href="${art.toDataURL("image/png")}"/>`,
    `</g>`,
    `<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">`,
    `<path d="${shape}"/>`,
    `<circle cx="${round2((scene.hole.cx - box.x) * scale)}" cy="${round2((scene.hole.cy - box.y) * scale)}" r="${round2(scene.hole.r * scale)}"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), `${profile.id}-${scene.longSideCm}cm-${PRINT_DPI}dpi.svg`, "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

/** Cut path plus a printable artwork layer for the square and round coaster blanks. */
function exportCoasterSvg() {
  const scale = exportScale();
  const box = sceneBox();
  const r = scene.rect;
  if (!box) return note("Add a photo before exporting.");
  const tx = ([x, y]) => [(x - box.x) * scale, (y - box.y) * scale];
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const shape = contoursToPathD([scene.outline.map(tx)], 2);
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  const ax = art.getContext("2d");
  ax.fillStyle = "#ffffff";
  ax.fillRect(0, 0, art.width, art.height);
  drawCover(ax, scene.image, 0, 0, art.width, art.height);
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.longSideCm} cm wide, ${PRINT_DPI} DPI</title>`,
    `<defs><clipPath id="CoasterShape"><path d="${shape}"/></clipPath></defs>`,
    `<g id="Artwork" clip-path="url(#CoasterShape)">`,
    `<image x="0" y="0" width="${width}" height="${height}" href="${art.toDataURL("image/png")}"/>`,
    `</g>`,
    `<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">`,
    `<path d="${shape}"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), `${profile.id}-${scene.longSideCm}cm-${PRINT_DPI}dpi.svg`, "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

/** The plate face plus a real cut path, the same artwork/cutline split the other SVG tools ship. */
function exportNamePlateSvg() {
  const scale = exportScale();
  const box = sceneBox();
  if (!box) return note("The plate could not be measured. Please reload the page and try again.");
  const tx = ([x, y]) => [(x - box.x) * scale, (y - box.y) * scale];
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const shape = contoursToPathD([scene.outline.map(tx)], 2);
  const art = document.createElement("canvas");
  art.width = Math.max(1, width);
  art.height = Math.max(1, height);
  const ax = art.getContext("2d");
  ax.scale(scale, scale);
  ax.translate(-box.x, -box.y);
  drawNamePlate(ax, scene, false);
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.spec.id.replace("x", " x ")} in, ${PRINT_DPI} DPI</title>`,
    `<defs><clipPath id="PlateShape"><path d="${shape}"/></clipPath></defs>`,
    `<g id="Artwork" clip-path="url(#PlateShape)">`,
    `<image x="0" y="0" width="${width}" height="${height}" href="${art.toDataURL("image/png")}"/>`,
    `</g>`,
    `<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">`,
    `<path d="${shape}"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), exportName("svg"), "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

/**
 * The puzzle export is deliberately two layers: a printable artwork layer and one magenta
 * cut layer. The outline is closed and every interior cut is open, so a laser cutter reads
 * the grid as one shared cut per edge instead of two cuts that drift apart at the knobs.
 */
function exportJigsawSvg() {
  const scale = exportScale();
  const box = sceneBox();
  const r = scene.rect;
  if (!box) return note("Upload a photo before exporting the puzzle.");
  const tx = ([x, y]) => [(x - box.x) * scale, (y - box.y) * scale];
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  const ax = art.getContext("2d");
  ax.fillStyle = "#ffffff";
  ax.fillRect(0, 0, art.width, art.height);
  drawCover(ax, scene.image, 0, 0, art.width, art.height);
  const outline = contoursToPathD([scene.outline.map(tx)], 2);
  const cuts = scene.cuts.map((cut) => '<path d="' + polylineToPathD(cut.map(tx), 2) + '"/>');
  const lines = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + " " + height + '" role="img">',
    '<title>Photo jigsaw puzzle cut file - ' + scene.grid.pieces + ' pieces, ' + scene.longSideCm + ' cm long side, ' + PRINT_DPI + " DPI</title>",
    '<g id="Artwork">',
    '<image x="0" y="0" width="' + art.width + '" height="' + art.height + '" href="' + art.toDataURL("image/png") + '"/>',
    "</g>",
    '<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">',
    '<path d="' + outline + '"/>',
    ...cuts,
    "</g>",
    "</svg>",
  ];
  downloadBlob(lines.join("\n"), exportName("svg"), "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm, pieces: scene.grid.pieces });
}

/** Cut path plus a printable artwork layer, the same split the sticker and ornament tools ship. */
function exportTopperSvg() {
  const scale = exportScale();
  const box = sceneBox();
  const r = scene.rect;
  if (!box || !scene.outline.length) return note("Type a name or a short message before exporting.");
  const tx = (points) => points.map(([x, y]) => [(x - box.x) * scale, (y - box.y) * scale]);
  const shape = contoursToPathD(scene.outline.map(tx), 2);
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  const ax = art.getContext("2d");
  ax.fillStyle = "#ffffff";
  ax.fillRect(0, 0, art.width, art.height);
  if (scene.image) drawCover(ax, scene.image, 0, 0, art.width, art.height);
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.longSideCm} cm wide, ${PRINT_DPI} DPI</title>`,
    `<defs><clipPath id="TopperShape"><path d="${shape}" clip-rule="evenodd"/></clipPath></defs>`,
    `<g id="Artwork" clip-path="url(#TopperShape)">`,
    `<image x="${round2((r.x - box.x) * scale)}" y="${round2((r.y - box.y) * scale)}" width="${art.width}" height="${art.height}" href="${art.toDataURL("image/png")}"/>`,
    `</g>`,
    `<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">`,
    `<path d="${shape}" fill-rule="evenodd"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), `${profile.id}-${scene.longSideCm}cm-${PRINT_DPI}dpi.svg`, "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

// ------------------------------------------------------------------ sample artwork

function sampleArtwork() {
  if (profile.id === "photo-keychain" || profile.id === "block" || profile.id === "luggage-tag" || profile.id === "pet-tag" || profile.id === "bookmark" || profile.id === "coaster" || profile.id === "jigsaw" || profile.id === "polaroid" || profile.id === "cupcake" || profile.id === "gift-tag" || profile.id === "coloring") return photoSampleArtwork();
  if (profile.id === "table-number") return photoSampleArtwork();
  if (profile.id === "sticker-outline") return stickerOutlineSampleArtwork();
  if (profile.id === "ornament") return ornamentSampleArtwork();
  if (profile.id === "name-keychain") return nameArtworkCanvas((nameInput?.value || "").trim() || "Tiny", nameFont?.value || "'Playfair Display', Georgia, serif");
  if (profile.id === "cake-topper") return topperArtworkCanvas(topperTextValue() || "Happy Birthday", topperFont?.value || DEFAULT_TOPPER_FONT, topperStyleName());
  const c = document.createElement("canvas");
  c.width = 600;
  c.height = 600;
  const x = c.getContext("2d");
  x.translate(300, 300);
  x.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 ? 150 : 280;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (i) x.lineTo(px, py); else x.moveTo(px, py);
  }
  x.closePath();
  const gradient = x.createLinearGradient(-280, -280, 280, 280);
  gradient.addColorStop(0, "#ef694c");
  gradient.addColorStop(1, "#4c8fef");
  x.fillStyle = gradient;
  x.fill();
  x.beginPath();
  x.arc(0, 0, 120, 0, Math.PI * 2);
  x.fillStyle = "#fffdf8";
  x.fill();
  x.fillStyle = "#1d2420";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.font = "800 92px Inter, Segoe UI, sans-serif";
  x.fillText("TC", 0, 6);
  return c;
}

/** A warm Christmas-night scene, so the tool is worth trying before any upload. */
function ornamentSampleArtwork() {
  const c = document.createElement("canvas");
  c.width = 900;
  c.height = 900;
  const x = c.getContext("2d");
  const sky = x.createLinearGradient(0, 0, 0, 900);
  sky.addColorStop(0, "#152a3d");
  sky.addColorStop(0.55, "#2f5f6f");
  sky.addColorStop(1, "#e6a866");
  x.fillStyle = sky;
  x.fillRect(0, 0, 900, 900);

  x.fillStyle = "rgba(255,255,255,.9)";
  x.beginPath();
  x.arc(690, 190, 66, 0, Math.PI * 2);
  x.fill();

  for (let i = 0; i < 90; i++) {
    const sx = (i * 137.508) % 900;
    const sy = ((i * 271.3) % 640);
    const sr = 1.5 + ((i * 7) % 5);
    x.fillStyle = `rgba(255,255,255,${0.35 + ((i % 5) / 10)})`;
    x.beginPath();
    x.arc(sx, sy, sr, 0, Math.PI * 2);
    x.fill();
  }

  x.fillStyle = "#2f5d43";
  x.beginPath();
  x.moveTo(450, 300);
  x.lineTo(360, 520);
  x.lineTo(540, 520);
  x.closePath();
  x.fill();
  x.beginPath();
  x.moveTo(450, 430);
  x.lineTo(330, 640);
  x.lineTo(570, 640);
  x.closePath();
  x.fill();
  x.beginPath();
  x.moveTo(450, 570);
  x.lineTo(300, 760);
  x.lineTo(600, 760);
  x.closePath();
  x.fill();
  x.fillStyle = "#6b4a2c";
  x.fillRect(432, 750, 36, 60);

  x.fillStyle = "rgba(255,255,255,.95)";
  x.beginPath();
  x.moveTo(0, 780);
  x.quadraticCurveTo(450, 700, 900, 780);
  x.lineTo(900, 900);
  x.lineTo(0, 900);
  x.closePath();
  x.fill();

  x.fillStyle = "rgba(29,36,32,.42)";
  x.font = "800 34px Inter, Segoe UI, sans-serif";
  x.textAlign = "center";
  x.fillText("SAMPLE PHOTO", 450, 862);
  return c;
}

function photoSampleArtwork() {
  const c = document.createElement("canvas");
  c.width = 720;
  c.height = 900;
  const x = c.getContext("2d");
  const sky = x.createLinearGradient(0, 0, 0, 900);
  sky.addColorStop(0, "#9bc9e8");
  sky.addColorStop(0.55, "#f3d6a7");
  sky.addColorStop(1, "#d98c68");
  x.fillStyle = sky;
  x.fillRect(0, 0, 720, 900);
  x.fillStyle = "rgba(255,255,255,.78)";
  x.beginPath();
  // Centred, so a very narrow crop (a bookmark slab) still shows the whole sun instead of a sliver.
  x.arc(360, 170, 62, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = "#7898a8";
  x.beginPath();
  x.moveTo(0, 640);
  x.lineTo(190, 390);
  x.lineTo(340, 600);
  x.lineTo(475, 430);
  x.lineTo(720, 690);
  x.lineTo(720, 900);
  x.lineTo(0, 900);
  x.closePath();
  x.fill();
  x.fillStyle = "#425f68";
  x.beginPath();
  x.moveTo(0, 760);
  x.lineTo(210, 570);
  x.lineTo(390, 745);
  x.lineTo(580, 555);
  x.lineTo(720, 680);
  x.lineTo(720, 900);
  x.lineTo(0, 900);
  x.closePath();
  x.fill();
  x.fillStyle = "rgba(255,255,255,.75)";
  x.font = "700 34px Inter, Segoe UI, sans-serif";
  x.textAlign = "center";
  // Kept in the sky rather than along the base, so it never sits under the engraved caption.
  x.fillText("SAMPLE PHOTO", 360, 300);
  return c;
}

/** Four simple stand-in frames so the strip tool is worth trying before any upload. */
function photoStripSamplePhotos() {
  const scenes = [
    ["#f8dcbd", "#e39a63", "#1d2420"],
    ["#d3e6f1", "#84aecb", "#1d2420"],
    ["#e5ead4", "#a3b98a", "#1d2420"],
    ["#f1d8e2", "#c287a6", "#1d2420"],
  ];
  return scenes.map((entry, index) => {
    const c = document.createElement("canvas");
    c.width = 900;
    c.height = 900;
    const x = c.getContext("2d");
    const sky = x.createLinearGradient(0, 0, 0, 900);
    sky.addColorStop(0, entry[0]);
    sky.addColorStop(1, entry[1]);
    x.fillStyle = sky;
    x.fillRect(0, 0, 900, 900);
    x.fillStyle = "rgba(255,255,255,.72)";
    x.beginPath();
    x.arc(300 + index * 90, 240 + index * 46, 104 + index * 14, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = "rgba(29,36,32,.18)";
    x.beginPath();
    x.moveTo(0, 640);
    x.quadraticCurveTo(450, 545 + index * 26, 900, 660);
    x.lineTo(900, 900);
    x.lineTo(0, 900);
    x.closePath();
    x.fill();
    x.fillStyle = "rgba(29,36,32,.5)";
    x.textAlign = "center";
    x.font = "600 44px 'Trebuchet MS', 'Segoe UI', sans-serif";
    x.fillText("SAMPLE " + (index + 1), 450, 830);
    return c;
  });
}

async function loadSample() {
  if (profile.id === "photo-strip") {
    // The strip sample is four frames plus a caption, which is what a finished strip looks like.
    note("Loading a sample strip so you can try the tool...");
    const frames = photoStripSamplePhotos();
    stripPhotos = [];
    for (const frame of frames) {
      try {
        stripPhotos.push(await loadImage(frame.toDataURL("image/png")));
      } catch (error) {
        // Skip a frame that will not decode rather than dropping the whole sample.
      }
    }
    if (!stripPhotos.length) return note("The sample could not load. Please upload photos instead.");
    if (stripCaptionInput && !stripCaptionInput.value.trim()) stripCaptionInput.value = "Tiny County Makers";
    setDownloadsEnabled(true);
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "place-card") {
    // The sample is a short guest list with the meal choices filled in, which is what a finished
    // sheet of place cards looks like once it is printed and cut.
    if (placeCardList && !placeCardList.value.trim()) {
      placeCardList.value = [
        "Sarah Chen, chicken",
        "Michael Ross, beef",
        "Priya Raman, vegetarian",
        "Tom Whitfield, fish",
        "Grace Okafor, kids",
        "Daniel & Elise Moreau, beef",
        "Hannah Blake, chicken",
        "Omar Haddad, vegetarian",
      ].join("\n");
    }
    placeCardPage = 0;
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "name-tracing") {
    // A worksheet is typed rather than uploaded, so the sample fills the box with a short list of
    // names the way a parent or teacher would, then leaves the first sheet on screen.
    if (traceName && !traceName.value.trim()) traceName.value = "Amelia\nNoah\nSophie";
    tracePage = 0;
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "crown-maker") {
    // A crown is typed rather than uploaded, so the sample fills the name box and leaves a
    // finished band on screen before anything is chosen.
    if (crownNameInput && !crownNameInput.value.trim()) crownNameInput.value = CROWN_SAMPLE.name;
    if (crownStyleSelect) crownStyleSelect.value = CROWN_SAMPLE.style;
    if (crownBandSelect) crownBandSelect.value = CROWN_SAMPLE.band;
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "multiplication-chart") {
    // A chart is typed rather than uploaded, so the sample loads the 1 to 12 grid a classroom
    // reaches for and leaves a finished sheet on screen.
    if (mulTitleInput && !mulTitleInput.value.trim()) mulTitleInput.value = MUL_SAMPLE.title;
    if (mulNameInput && !mulNameInput.value.trim()) mulNameInput.value = MUL_SAMPLE.name;
    if (mulRangeSelect) mulRangeSelect.value = MUL_SAMPLE.max;
    if (mulTypeSelect) mulTypeSelect.value = MUL_SAMPLE.type;
    if (mulFillSelect) mulFillSelect.value = MUL_SAMPLE.fill;
    if (mulSquaresSelect) mulSquaresSelect.value = MUL_SAMPLE.squares;
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "chore-chart") {
    // A chart is typed rather than uploaded, so the sample fills the boxes with a practical
    // family week and leaves a finished sheet on screen.
    if (chartTitleInput && !chartTitleInput.value.trim()) chartTitleInput.value = "My weekly chores";
    if (chartNameInput && !chartNameInput.value.trim()) chartNameInput.value = "Alex";
    if (chartChoresInput && !chartChoresInput.value.trim()) chartChoresInput.value = CHART_SAMPLE.join("\n");
    if (chartRewardInput && !chartRewardInput.value.trim()) chartRewardInput.value = "Choose the Friday movie";
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "bingo") {
    // A card set is drawn rather than uploaded, so the sample fills the box with a short themed
    // list, switches to word mode and leaves a finished set of cards on screen.
    const theme = bingoTheme("animals");
    if (bcWords && !bcWords.value.trim() && theme) bcWords.value = theme.words.join("\n");
    if (bcTitle && !bcTitle.value.trim()) bcTitle.value = "Animal bingo";
    if (bcMode) bcMode.value = "words";
    if (bcCount) bcCount.value = "4";
    bingoSeed = 1;
    bingoPage = 0;
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "word-search") {
    // A puzzle is typed rather than uploaded, so the sample fills the box with a short animal list
    // and leaves a finished puzzle on screen.
    if (wsWords && !wsWords.value.trim()) wsWords.value = "ELEPHANT\nGIRAFFE\nPENGUIN\nDOLPHIN\nRABBIT\nTIGER";
    if (wsTitle && !wsTitle.value.trim()) wsTitle.value = "Sample word search";
    wsSeed = 1;
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "gift-tag") {
    // A finished tag is the best demo, so the sample fills the card and leaves a message and a
    // To / From pair the way a real visitor would fill them.
    note("Loading a sample photo so you can try the tool...");
    if (giftTagText && !giftTagText.value.trim()) giftTagText.value = "Merry Christmas";
    if (giftTagTo && !giftTagTo.value.trim()) giftTagTo.value = "Sophie";
    if (giftTagFrom && !giftTagFrom.value.trim()) giftTagFrom.value = "The Harpers";
    const ok = await adoptImage(sampleArtwork().toDataURL("image/png"));
    if (!ok) return note("The sample could not load. Please upload a photo instead.");
    adoptSource("sample");
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "cupcake") {
    // A finished topper is the best demo, so the sample fills the disc and leaves a message.
    note("Loading a sample photo so you can try the tool...");
    if (cupcakeText && !cupcakeText.value.trim()) cupcakeText.value = "Happy Birthday";
    const ok = await adoptImage(sampleArtwork().toDataURL("image/png"));
    if (!ok) return note("The sample could not load. Please upload a photo instead.");
    adoptSource("sample");
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "polaroid") {
    // A finished frame is the best demo, so the sample fills the window and leaves a caption in
    // the border the way a real instant photo would.
    note("Loading a sample photo so you can try the tool...");
    if (polaroidCaption && !polaroidCaption.value.trim()) polaroidCaption.value = "Summer, 2026";
    const ok = await adoptImage(sampleArtwork().toDataURL("image/png"));
    if (!ok) return note("The sample could not load. Please upload a photo instead.");
    adoptSource("sample");
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "table-number") {
    // The sample is a finished card, so the number and the names are filled in the way a real
    // visitor would fill them and the shared sample photo stands in for their picture.
    if (tableNumberText && !tableNumberText.value.trim()) tableNumberText.value = "12";
    if (tableNumberNames && !tableNumberNames.value.trim()) tableNumberNames.value = "Sarah & James";
    note("Loading a sample photo so you can try the tool...");
    const ok = await adoptImage(sampleArtwork().toDataURL("image/png"));
    if (!ok) return note("The sample could not load. Please upload a photo instead.");
    adoptSource("sample");
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "name-plate") {
    // The plate sample is typed copy plus a logo mark, so the shared sample canvas stands in
    // for the logo and the fields are filled the way a real visitor would fill them.
    if (plateName) plateName.value = "Eleanor Whitfield";
    if (plateTitle) plateTitle.value = "Principal Designer";
    if (plateCompany) plateCompany.value = "Whitfield Studio";
    if (finishSelect) finishSelect.value = "black";
    try {
      plateLogo = await loadImage(sampleArtwork().toDataURL("image/png"));
    } catch (error) {
      plateLogo = null;
    }
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  note("Loading a sample image so you can try the tool...");
  const ok = await adoptImage(sampleArtwork().toDataURL("image/png"));
  if (!ok) return note("The sample could not load. Please upload an image instead.");
  adoptSource("sample");
  track("sample_loaded", { product: profile.id });
}

function adoptSource(label) {
  const badge = document.querySelector("#sourceBadge");
  if (!badge) return;
  if (label !== "sample") {
    badge.textContent = "";
    return;
  }
  // A typed tool has no file to swap out, so it says what the sample is instead of telling a
  // visitor to replace an upload they never made.
  badge.textContent = document.querySelector("#photo")
    ? "Sample image - replace with your own file anytime"
    : "Sample loaded - edit the fields to make it yours";
}

// ------------------------------------------------------------------ helpers

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const value = new Image();
    value.onload = () => resolve(value);
    value.onerror = reject;
    value.src = src;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function download(href, name) {
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadBlob(text, name, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  download(url, name);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function track(event, metadata = {}) {
  const endpoint = window.TCM_CONFIG?.analyticsEndpoint;
  const params = new URLSearchParams(location.search);
  const qaMode = params.has("qa") ? params.get("qa") : null;
  if (!endpoint || !location.hostname.endsWith("github.io") || navigator.doNotTrack === "1") return;
  if (qaMode !== null && qaMode !== "track") return;
  const sessionId = sessionStorage.getItem("tcm-analytics-session") || (qaMode === "track" ? "qa_" : "") + crypto.randomUUID().replaceAll("-", "");
  sessionStorage.setItem("tcm-analytics-session", sessionId);
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    keepalive: true,
    body: JSON.stringify({
      event,
      sessionId,
      pagePath: location.pathname,
      deviceType: /Mobile/i.test(navigator.userAgent) ? "mobile" : "desktop",
      metadata: { product: profile.id, ...metadata },
    }),
  }).catch(() => {});
}

/* Privacy-first engagement signals: how long a visitor actually spends on a tool. */
(() => {
  let activeSeconds = 0;
  let scrolledHalfway = false;
  setInterval(() => {
    if (document.visibilityState !== "visible" || !document.hasFocus()) return;
    activeSeconds += 1;
    if (activeSeconds === 10) track("engaged_10s");
    if (activeSeconds === 30) track("engaged_30s");
  }, 1000);
  document.addEventListener("scroll", () => {
    if (scrolledHalfway) return;
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    if (scrollable > 0 && scrollY / scrollable >= 0.5) {
      scrolledHalfway = true;
      track("scroll_50");
    }
  }, { passive: true });
})();

/* Mobile tools menu: the long nav collapses behind one button on small screens. */
(() => {
  const header = document.querySelector("header.top");
  const nav = header && header.querySelector("nav");
  if (!header || !nav || header.querySelector(".nav-toggle")) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open the tools menu");
  toggle.innerHTML = "<i></i><i></i><i></i>";
  if (!nav.id) nav.id = "site-nav";
  toggle.setAttribute("aria-controls", nav.id);
  header.append(toggle);
  header.classList.add("nav-ready");

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close the tools menu" : "Open the tools menu");
  };
  const isOpen = () => header.classList.contains("nav-open");

  toggle.addEventListener("click", () => setOpen(!isOpen()));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (isOpen() && !header.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  addEventListener("resize", () => {
    if (isOpen() && innerWidth > 860) setOpen(false);
  });
})();
