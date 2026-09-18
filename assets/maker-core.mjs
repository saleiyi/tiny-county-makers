// Tiny County Makers - shared maker engine.
// Pure product config + cutline geometry. Imported by the browser app and by Node tests.

// The acrylic photo block is sold in imperial sizes, so the engine keeps the centimetre
// value it needs for print maths next to the inch label shoppers actually search for.
export const PHOTO_BLOCK_SIZES = Object.freeze([
  { id: "2x2", widthCm: 5.08, heightCm: 5.08, label: "2 x 2 in (5 x 5 cm)" },
  { id: "4x4", widthCm: 10.16, heightCm: 10.16, label: "4 x 4 in (10 x 10 cm)" },
  { id: "5x7", widthCm: 12.7, heightCm: 17.78, label: "5 x 7 in (13 x 18 cm)" },
  { id: "8x10", widthCm: 20.32, heightCm: 25.4, label: "8 x 10 in (20 x 25 cm)" },
]);
/** Long sides an acrylic luggage tag is sold in, in centimetres. */
export const LUGGAGE_TAG_SIZES = Object.freeze([7, 9, 11]);

/**
 * A pet ID tag is the same acrylic family as the bag tag, just sized for a collar: the long
 * side is the diameter, so 3, 4 and 5 cm cover the discs people actually buy for cats and
 * small dogs. The photo sits on the front and the name and phone number are etched under it.
 */
export const PET_TAG_SIZES = Object.freeze([3, 4, 5]);

/** Every silhouette the pet ID tag tool offers, in the order the UI lists them. */
export const PET_TAG_SHAPES = Object.freeze(["circle", "oval", "rounded", "tag"]);

/** Long sides an acrylic cake topper is sold in, in centimetres. */
export const CAKE_TOPPER_SIZES = Object.freeze([10, 12, 15]);

/** How a cake topper is built: bare letters, letters welded to a bar, or a drilled plaque. */
export const CAKE_TOPPER_STYLES = Object.freeze(["cutout", "bar", "plaque"]);

/** Long sides an acrylic bookmark is sold in, in centimetres. */
export const BOOKMARK_SIZES = Object.freeze([15, 18, 20]);

/** Every silhouette the acrylic bookmark tool can draw, in the order the UI offers them. */
export const BOOKMARK_SHAPES = Object.freeze(["classic", "arch", "notch", "pointed"]);
/** Footprint an acrylic coaster is sold in, in centimetres. */
export const COASTER_SIZES = Object.freeze([9, 10, 11]);

/** Every silhouette the acrylic coaster tool can draw, in the order the UI offers them. */
export const COASTER_SHAPES = Object.freeze(["square", "round"]);

/**
 * Desk name plates are sold in inches. A 2 inch tall plate is the office default and the 8,
 * 10 and 12 inch widths are the three sizes every supplier stocks, so the engine keeps the
 * inch label next to the centimetre value the print maths needs.
 */
export const DESK_NAME_PLATE_SIZES = Object.freeze([
  { id: "2x8", widthCm: 20.32, heightCm: 5.08, label: "2 x 8 in (20 x 5 cm)" },
  { id: "2x10", widthCm: 25.4, heightCm: 5.08, label: "2 x 10 in (25 x 5 cm)" },
  { id: "2x12", widthCm: 30.48, heightCm: 5.08, label: "2 x 12 in (30 x 5 cm)" },
]);

/** Every acrylic finish the desk name plate tool offers, in the order the UI lists them. */
export const NAME_PLATE_FINISHES = Object.freeze(["black", "clear", "frosted"]);

/** Long sides a photo jigsaw puzzle is made in, in centimetres. */
export const JIGSAW_PUZZLE_SIZES = Object.freeze([15, 20, 25, 30]);

/**
 * The piece grids the puzzle tool offers, easiest first. A square grid keeps the cut pattern
 * even, and every step maps to a piece count shoppers already know from shop-bought puzzles.
 */
export const JIGSAW_GRIDS = Object.freeze([
  { id: "3x3", cols: 3, rows: 3, pieces: 9, label: "3 x 3 - 9 pieces" },
  { id: "4x4", cols: 4, rows: 4, pieces: 16, label: "4 x 4 - 16 pieces" },
  { id: "5x5", cols: 5, rows: 5, pieces: 25, label: "5 x 5 - 25 pieces" },
  { id: "6x6", cols: 6, rows: 6, pieces: 36, label: "6 x 6 - 36 pieces" },
]);

/**
 * The printable long sides for a bordered sticker, in centimetres. The small end suits
 * planners and phone cases; the large end suits a laptop lid or a water bottle.
 */
export const STICKER_OUTLINE_SIZES = Object.freeze([4, 6, 8, 10]);

/**
 * Border colours that cover almost every "make it look like a real sticker" request.
 * The picker on the page still accepts any hex, these are just the one-click answers.
 */
export const STICKER_BORDER_PRESETS = Object.freeze([
  { id: "white", label: "white", hex: "#ffffff" },
  { id: "black", label: "black", hex: "#14181a" },
  { id: "cream", label: "cream", hex: "#f7efe1" },
  { id: "grey", label: "grey", hex: "#a8b0b3" },
]);

/**
 * A photo booth strip is cut from a 2 in wide column of photos, so the printed width is the
 * product size here: 5.08 cm is one strip and 10.16 cm is the 4 x 6 in sheet that carries two
 * of them, which is the print every pharmacy and photo lab actually sells.
 */
export const PHOTO_STRIP_SIZES = Object.freeze([
  { id: "2x6", widthCm: 5.08, heightCm: 15.24, cols: 1, label: "2 x 6 in - one strip (5 x 15 cm)" },
  { id: "4x6", widthCm: 10.16, heightCm: 15.24, cols: 2, label: "4 x 6 in - two strips on one print (10 x 15 cm)" },
]);

/** How many photos one strip is divided into. Four is the classic booth layout. */
export const PHOTO_STRIP_COUNTS = Object.freeze([3, 4]);

/** The paper colours a photo strip is normally printed on, in the order the tool lists them. */
export const PHOTO_STRIP_PAPERS = Object.freeze([
  { id: "white", label: "white", hex: "#ffffff" },
  { id: "black", label: "black", hex: "#14181a" },
  { id: "cream", label: "cream", hex: "#f7efe1" },
  { id: "blush", label: "blush", hex: "#f4dede" },
]);

/**
 * A table number is a portrait card that stands in the middle of a wedding table, so it is sold
 * in the two print sizes every lab and home printer handles, plus the A5 that fits a frame. The
 * height is the long side, which is what the shared print maths keys off.
 */
export const TABLE_NUMBER_SIZES = Object.freeze([
  { id: "4x6", widthCm: 10.16, heightCm: 15.24, shorter: "4 x 6 in", label: "4 x 6 in portrait (10 x 15 cm)", short: "4 x 6 in (10 x 15 cm)" },
  { id: "5x7", widthCm: 12.7, heightCm: 17.78, shorter: "5 x 7 in", label: "5 x 7 in portrait (13 x 18 cm)", short: "5 x 7 in (13 x 18 cm)" },
  { id: "a5", widthCm: 14.8, heightCm: 21, shorter: "A5", label: "A5 portrait (15 x 21 cm)", short: "A5 (15 x 21 cm)" },
]);

/** The card silhouettes the table number tool can draw, in the order the UI offers them. */
export const TABLE_NUMBER_SHAPES = Object.freeze(["arch", "rectangle", "rounded"]);

/** The card stocks a table number is normally printed on, in the order the tool lists them. */
export const TABLE_NUMBER_PAPERS = Object.freeze([
  { id: "white", label: "white", hex: "#ffffff" },
  { id: "ivory", label: "ivory", hex: "#f7f1e4" },
  { id: "blush", label: "blush", hex: "#f3dede" },
  { id: "sage", label: "sage", hex: "#dce5d8" },
  { id: "black", label: "black", hex: "#14181a" },
]);

/**
 * A place card is the small card beside each guest's plate, and couples print a whole sheet of
them at home, so the sheet of paper - not a single card - is the product this tool works in. The
card footprint stays fixed so a long guest list prints on identical cards.
 */
export const PLACE_CARD_SHEETS = Object.freeze([
  { id: "letter", widthCm: 21.59, heightCm: 27.94, shorter: "US Letter", label: "US Letter, 10 cards a sheet", short: "US Letter (8.5 x 11 in)" },
  { id: "a4", widthCm: 21, heightCm: 29.7, shorter: "A4", label: "A4, 10 cards a sheet", short: "A4 (21 x 30 cm)" },
]);

/** The two cards a place card can be: a folded tent that stands on its own, or a flat card. */
export const PLACE_CARD_STYLES = Object.freeze(["tent", "flat"]);

/** The card stock a place card is normally printed on, in the order the tool lists them. */
export const PLACE_CARD_PAPERS = Object.freeze([
  { id: "white", label: "white", hex: "#ffffff" },
  { id: "ivory", label: "ivory", hex: "#f7f1e4" },
  { id: "blush", label: "blush", hex: "#f3dede" },
  { id: "sage", label: "sage", hex: "#dce5d8" },
  { id: "black", label: "black", hex: "#14181a" },
]);

/** The card footprint in centimetres; a tent card prints as the unfolded 3.5 x 4 in panel. */
export const PLACE_CARD_FOOTPRINTS = Object.freeze({
  flat: Object.freeze({ widthCm: 8.89, heightCm: 5.08 }),
  tent: Object.freeze({ widthCm: 8.89, heightCm: 10.16 }),
});

/** The border every home printer leaves unprinted, used to seat the card grid on the sheet. */
export const PLACE_CARD_MARGIN_CM = 1.27;

/** The most names one sheet of paper is allowed to carry, so a huge list cannot stall a phone. */
export const PLACE_CARD_LIMIT = 120;

/** The meal choices a guest line can carry, with the words the parser looks for. */
export const PLACE_CARD_MEALS = Object.freeze([
  { id: "beef", label: "Beef", words: ["beef", "steak", "red meat", "lamb", "pork"] },
  { id: "chicken", label: "Chicken", words: ["chicken", "poultry", "turkey"] },
  { id: "fish", label: "Fish", words: ["fish", "salmon", "seafood", "prawn", "shrimp"] },
  { id: "veg", label: "Vegetarian", words: ["veg", "vegetarian", "vegan", "plant"] },
  { id: "kids", label: "Kids", words: ["kid", "child", "children", "junior"] },
]);

/**
 * The instant-film frames people actually buy refills for. Each one carries the real film
 * footprint and the photo window measured from the top-left corner, so the printed frame drops
 * straight into the plastic one it is going into instead of a generic white border.
 */
export const POLAROID_FRAMES = Object.freeze([
  { id: "classic", label: "Classic Polaroid, 3.5 x 4.2 in", short: "Classic Polaroid", widthCm: 8.8, heightCm: 10.7, window: Object.freeze({ x: 0.45, y: 0.45, w: 7.9, h: 7.9 }) },
  { id: "mini", label: "Instax Mini, 2.1 x 3.4 in", short: "Instax Mini", widthCm: 5.4, heightCm: 8.6, window: Object.freeze({ x: 0.4, y: 0.4, w: 4.6, h: 6.2 }) },
  { id: "square", label: "Instax Square, 3.4 x 2.8 in", short: "Instax Square", widthCm: 8.6, heightCm: 7.2, window: Object.freeze({ x: 1.2, y: 0.45, w: 6.2, h: 6.2 }) },
  { id: "wide", label: "Instax Wide, 4.3 x 3.4 in", short: "Instax Wide", widthCm: 10.8, heightCm: 8.6, window: Object.freeze({ x: 0.45, y: 0.4, w: 9.9, h: 6.2 }) },
]);

/** The frame colours instant film is actually sold in, in the order the tool lists them. */
export const POLAROID_PAPERS = Object.freeze([
  { id: "white", label: "white", hex: "#ffffff" },
  { id: "cream", label: "cream", hex: "#f7f1e4" },
  { id: "black", label: "black", hex: "#14181a" },
  { id: "kraft", label: "kraft", hex: "#c9a978" },
  { id: "blush", label: "blush", hex: "#f3dede" },
]);

/**
 * The looks an instant photo is graded with. Each one is a single canvas blend painted over the
 * photo window, so the same recipe paints the preview and the download and no phone browser has
 * to implement a filter the desktop one refuses.
 */
export const POLAROID_FINISHES = Object.freeze([
  { id: "original", label: "Original colours", op: "", hex: "#ffffff", alpha: 0 },
  { id: "warm", label: "Warm film", op: "overlay", hex: "#ff9e57", alpha: 0.22 },
  { id: "faded", label: "Faded", op: "lighten", hex: "#efe2cf", alpha: 0.26 },
  { id: "mono", label: "Black and white", op: "saturation", hex: "#8a8a8a", alpha: 1 },
]);

/** The paper a whole run of frames is tiled onto for printing, in the order the tool lists them. */
export const POLAROID_SHEETS = Object.freeze([
  { id: "letter", widthCm: 21.59, heightCm: 27.94, short: "US Letter", label: "US Letter sheet" },
  { id: "a4", widthCm: 21, heightCm: 29.7, short: "A4", label: "A4 sheet" },
]);

/** The border a home printer leaves unprinted, and the gap left between two tiled frames. */
export const POLAROID_MARGIN_CM = 1.27;
export const POLAROID_GUTTER_CM = 0.4;

/**
 * Printed cupcake topper sizes. These are the three round cutters people search for, kept in
 * centimetres next to the inch name so the printer maths and the label agree.
 */
export const CUPCAKE_TOPPER_SIZES = Object.freeze([
  { id: "2in", inches: 2, widthCm: 5.08, heightCm: 5.08, short: "2 in", label: "2 inch toppers (5.1 cm)" },
  { id: "2-5in", inches: 2.5, widthCm: 6.35, heightCm: 6.35, short: "2.5 in", label: "2.5 inch toppers (6.4 cm)" },
  { id: "3in", inches: 3, widthCm: 7.62, heightCm: 7.62, short: "3 in", label: "3 inch toppers (7.6 cm)" },
]);

/** Every silhouette the cupcake topper tool can draw, in the order the UI offers them. */
export const CUPCAKE_SHAPES = Object.freeze(["circle", "scallop", "rounded", "square"]);

/** The paper a whole run of cupcake toppers is tiled onto for printing. */
export const CUPCAKE_SHEETS = Object.freeze([
  { id: "letter", widthCm: 21.59, heightCm: 27.94, short: "US Letter", label: "US Letter sheet" },
  { id: "a4", widthCm: 21, heightCm: 29.7, short: "A4", label: "A4 sheet" },
]);

/** Card colours sold for party toppers, in the order the tool lists them. */
export const CUPCAKE_PAPERS = Object.freeze([
  { id: "white", label: "white", hex: "#ffffff" },
  { id: "ivory", label: "ivory", hex: "#f7f1e4" },
  { id: "blush", label: "blush", hex: "#f3dede" },
  { id: "sage", label: "sage", hex: "#dce5d8" },
  { id: "kraft", label: "kraft", hex: "#c9a978" },
  { id: "black", label: "black", hex: "#14181a" },
]);

/**
 * The two papers a handwriting worksheet is printed on. Every row on the sheet is measured
 * from these numbers, so the ruled lines land in the same place on screen and on paper.
 */
export const NAME_TRACING_PAPERS = Object.freeze([
  { id: "letter", widthCm: 21.59, heightCm: 27.94, short: "US Letter", label: "US Letter (8.5 x 11 in)" },
  { id: "a4", widthCm: 21, heightCm: 29.7, short: "A4", label: "A4 (21 x 29.7 cm)" },
]);

/**
 * How the practice rows are drawn. A dotted or dashed row is stroked as an outline with a dash
 * pattern measured in fractions of the letter height, so the dots stay in proportion on a
 * phone and on a 300 DPI page alike.
 */
export const NAME_TRACING_STYLES = Object.freeze([
  { id: "dotted", label: "Dotted outline", mode: "stroke", dash: [0.06, 0.16], alpha: 1 },
  { id: "dashed", label: "Dashed outline", mode: "stroke", dash: [0.22, 0.16], alpha: 1 },
  { id: "hollow", label: "Hollow outline", mode: "stroke", dash: null, alpha: 1 },
  { id: "grey", label: "Light grey", mode: "fill", dash: null, alpha: 0.26 },
  { id: "solid", label: "Solid black", mode: "fill", dash: null, alpha: 1 },
]);

/**
 * The ruled lines under the writing. Blue-red-blue is the school paper a lot of parents and
 * teachers ask for by name: a blue headline, a red dashed midline and a blue baseline.
 */
export const NAME_TRACING_RULES = Object.freeze([
  { id: "blue-red-blue", label: "Blue top line, red dashed middle, blue base line", top: "#2f6fd0", mid: "#e0483a", base: "#2f6fd0", dashMid: true },
  { id: "grey-ruled", label: "Grey three-line school paper", top: "#a8b0ad", mid: "#c3c9c6", base: "#a8b0ad", dashMid: true },
  { id: "baseline", label: "A single writing line", top: "", mid: "", base: "#a8b0ad", dashMid: false },
  { id: "none", label: "No guide lines", top: "", mid: "", base: "", dashMid: false },
]);

/** The letter case a worksheet is set in. A name is a proper noun, so as typed comes first. */
export const NAME_TRACING_CASES = Object.freeze([
  { id: "as-typed", label: "As typed" },
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "title", label: "Title Case" },
]);

/** The pencil colours a worksheet is printed in, in the order the tool lists them. */
export const NAME_TRACING_INKS = Object.freeze([
  { id: "graphite", label: "graphite", hex: "#4a5250" },
  { id: "blue", label: "blue", hex: "#2f6fd0" },
  { id: "green", label: "green", hex: "#2f7d4f" },
  { id: "violet", label: "violet", hex: "#6b4bb0" },
  { id: "black", label: "black", hex: "#14181a" },
]);

/** The printer border a worksheet keeps, and the tallest a single writing row is allowed to get. */
export const NAME_TRACING_MARGIN_CM = 1.27;
export const NAME_TRACING_BAND_MAX_CM = 3.4;
export const NAME_TRACING_HEADER_CM = 1.6;

/** The most names one batch can carry, so a whole class list still prints in one sitting. */
export const NAME_TRACING_LIMIT = 40;

/** How many practice rows and blank rows a worksheet can be built from. */
export const NAME_TRACING_ROW_MIN = 2;
export const NAME_TRACING_ROW_MAX = 10;
export const NAME_TRACING_BLANK_MAX = 6;

/** The safe printer border and the gap between toppers on a printable sheet. */
export const CUPCAKE_MARGIN_CM = 0.8;
export const CUPCAKE_GUTTER_CM = 0.25;

/**
 * Printed gift tags. These are the three footprints craft shops sell and people search for,
 * held in centimetres next to the inch name so the printer maths and the dropdown agree.
 */
export const GIFT_TAG_SIZES = Object.freeze([
  { id: "2x3", short: "2 x 3 in", label: "2 x 3 in tag (5.1 x 7.6 cm)", widthCm: 5.08, heightCm: 7.62 },
  { id: "2-5x3-5", short: "2.5 x 3.5 in", label: "2.5 x 3.5 in tag (6.4 x 8.9 cm)", widthCm: 6.35, heightCm: 8.89 },
  { id: "3x4", short: "3 x 4 in", label: "3 x 4 in tag (7.6 x 10.2 cm)", widthCm: 7.62, heightCm: 10.16 },
]);

/** Every silhouette the gift tag tool can cut, in the order the UI offers them. */
export const GIFT_TAG_SHAPES = Object.freeze(["tag", "rounded", "scallop", "square"]);

/** The paper a whole run of gift tags is tiled onto for printing. */
export const GIFT_TAG_SHEETS = Object.freeze([
  { id: "letter", widthCm: 21.59, heightCm: 27.94, short: "US Letter", label: "US Letter sheet" },
  { id: "a4", widthCm: 21, heightCm: 29.7, short: "A4", label: "A4 sheet" },
]);

/** Card colours sold for gift tags, in the order the tool lists them. */
export const GIFT_TAG_PAPERS = Object.freeze([
  { id: "white", label: "white", hex: "#ffffff" },
  { id: "ivory", label: "ivory", hex: "#f7f1e4" },
  { id: "blush", label: "blush", hex: "#f3dede" },
  { id: "sage", label: "sage", hex: "#dce5d8" },
  { id: "kraft", label: "kraft", hex: "#c9a978" },
  { id: "black", label: "black", hex: "#14181a" },
]);

/** The safe printer border and the gap between tags on a printable sheet. */
export const GIFT_TAG_MARGIN_CM = 0.8;
export const GIFT_TAG_GUTTER_CM = 0.25;

/**
 * A printable word search puzzle. The grid is drawn at the paper size the puzzle prints on,
 * so the cells land the same size on screen and on a 300 DPI sheet.
 */
export const WORD_SEARCH_PAPERS = Object.freeze([
  { id: "letter", widthCm: 21.59, heightCm: 27.94, short: "US Letter", label: "US Letter (8.5 x 11 in)" },
  { id: "a4", widthCm: 21, heightCm: 29.7, short: "A4", label: "A4 (21 x 29.7 cm)" },
]);

/**
 * The grid sizes the puzzle offers. "auto" is the only one that grows: it starts at ten cells
 * and opens up until the longest word and the whole list can be seated without crowding.
 */
export const WORD_SEARCH_GRIDS = Object.freeze([
  { id: "auto", label: "Auto - fit my word list", cells: 0 },
  { id: "10", label: "10 x 10 quick puzzle", cells: 10 },
  { id: "12", label: "12 x 12", cells: 12 },
  { id: "15", label: "15 x 15 classroom size", cells: 15 },
  { id: "18", label: "18 x 18 big list", cells: 18 },
]);

/**
 * The direction set is the whole difficulty. Across and down only is the puzzle a beginner
 * finishes; the diagonals and the reversed spellings are what turn the same square grid into
 * the puzzle a teenager has to hunt through.
 */
export const WORD_SEARCH_LEVELS = Object.freeze([
  { id: "easy", label: "Easy - across and down only", dirs: [[1, 0], [0, 1]] },
  { id: "medium", label: "Medium - adds one diagonal", dirs: [[1, 0], [0, 1], [1, 1]] },
  { id: "hard", label: "Hard - all eight directions", dirs: [[1, 0], [0, 1], [1, 1], [1, -1], [-1, 0], [0, -1], [-1, -1], [-1, 1]] },
]);

/** The two letter cases a puzzle is set in. Uppercase is the classroom default. */
export const WORD_SEARCH_CASES = Object.freeze([
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
]);

/** Ready-made lists, so a teacher can tap once and print a themed puzzle. */
export const WORD_SEARCH_THEMES = Object.freeze([
  { id: "animals", label: "Animals", words: ["ELEPHANT", "GIRAFFE", "PENGUIN", "DOLPHIN", "RABBIT", "TIGER", "MONKEY", "TURTLE", "ZEBRA", "PANDA", "KOALA", "OTTER"] },
  { id: "fruits", label: "Fruit and veg", words: ["APPLE", "BANANA", "CHERRY", "GRAPES", "MANGO", "MELON", "ORANGE", "PEACH", "CARROT", "POTATO", "TOMATO", "PUMPKIN"] },
  { id: "colors", label: "Colours", words: ["RED", "BLUE", "GREEN", "YELLOW", "ORANGE", "PURPLE", "PINK", "BROWN", "BLACK", "WHITE", "SILVER", "GOLD"] },
  { id: "school", label: "School", words: ["PENCIL", "RULER", "TEACHER", "LIBRARY", "HOMEWORK", "CLASSROOM", "NOTEBOOK", "BACKPACK", "CRAYON", "ERASER", "DESK", "BELL"] },
  { id: "space", label: "Space", words: ["ROCKET", "PLANET", "SATURN", "METEOR", "GALAXY", "ORBIT", "COMET", "NEBULA", "ASTEROID", "ASTRONAUT", "MOON", "STAR"] },
  { id: "ocean", label: "Ocean", words: ["WHALE", "SHARK", "CORAL", "OCTOPUS", "SEAHORSE", "DOLPHIN", "JELLYFISH", "STARFISH", "TURTLE", "PLANKTON", "ANCHOR", "SHELL"] },
  { id: "halloween", label: "Halloween", words: ["PUMPKIN", "GHOST", "WITCH", "SPIDER", "CANDY", "SKELETON", "VAMPIRE", "OCTOBER", "COSTUME", "BAT", "MUMMY", "CAULDRON"] },
  { id: "christmas", label: "Christmas", words: ["SANTA", "REINDEER", "SNOWMAN", "STOCKING", "PRESENT", "MISTLETOE", "GINGERBREAD", "ORNAMENT", "HOLLY", "CAROL", "SLEIGH", "ELF"] },
  { id: "summer", label: "Summer", words: ["SUNSHINE", "BEACH", "POPSICLE", "SANDCASTLE", "SEASHELL", "VACATION", "SUMMER", "POOL", "OCEAN", "PICNIC", "CAMPING", "SUNSCREEN"] },
  { id: "sports", label: "Sports", words: ["SOCCER", "TENNIS", "BASEBALL", "BASKETBALL", "SWIMMING", "RUNNING", "CYCLING", "HOCKEY", "VOLLEYBALL", "SKATING", "BOXING", "GOLF"] },
  { id: "weather", label: "Weather", words: ["RAINBOW", "THUNDER", "LIGHTNING", "SNOWFLAKE", "CLOUD", "SUNSHINE", "UMBRELLA", "BREEZE", "STORM", "FOG", "HAIL", "WIND"] },
  { id: "feelings", label: "Feelings", words: ["HAPPY", "EXCITED", "CALM", "BRAVE", "CURIOUS", "GRATEFUL", "KIND", "PROUD", "FRIENDLY", "PATIENT", "HONEST", "CHEERFUL"] },
]);

/** The most words one puzzle carries, so a long list still fits a printable grid. */
export const WORD_SEARCH_LIMIT = 24;
/** The longest single word the grid will accept, so one long entry cannot blow out the square. */
export const WORD_SEARCH_WORD_MAX = 20;
/** The safe printer border, the title band and the word list band on a puzzle sheet. */
export const WORD_SEARCH_MARGIN_CM = 1.27;
export const WORD_SEARCH_TITLE_CM = 1.6;
export const WORD_SEARCH_LIST_CM = 2.4;
/** How many rows of eight the word list is folded into before the sheet grows a second column. */
export const WORD_SEARCH_LIST_COLUMNS = 3;

/**
 * A printable bingo set. A game is printed rather than uploaded, so the paper, the card grid and
 * the sheet layout are the whole recipe, and the same numbers drive the live preview and the
 * 300 DPI download. Cards are laid out in centimetres so the print matches the screen.
 */
export const BINGO_PAPERS = Object.freeze([
  { id: "letter", widthCm: 21.59, heightCm: 27.94, short: "US Letter", label: "US Letter (8.5 x 11 in)" },
  { id: "a4", widthCm: 21, heightCm: 29.7, short: "A4", label: "A4 (21 x 29.7 cm)" },
]);

/** Card grids. Five square is the classic B/I/N/G/O board; the smaller squares suit younger players. */
export const BINGO_GRIDS = Object.freeze([
  { id: "5", cells: 5, label: "5 x 5 classic card" },
  { id: "4", cells: 4, label: "4 x 4 quick card" },
  { id: "3", cells: 3, label: "3 x 3 first card" },
]);

/** How many cards land on one printed sheet. */
export const BINGO_LAYOUTS = Object.freeze([
  { id: "1", cols: 1, rows: 1, label: "1 large card" },
  { id: "2", cols: 1, rows: 2, label: "2 cards per sheet" },
  { id: "4", cols: 2, rows: 2, label: "4 cards per sheet" },
]);

/** A card is either a shuffled 1 to 75 number board or a board built from the visitor's own list. */
export const BINGO_MODES = Object.freeze([
  { id: "numbers", label: "Numbers 1 to 75 (classic)" },
  { id: "words", label: "My own words" },
]);

/** The B/I/N/G/O headings the classic board is drawn from. Each letter owns fifteen numbers. */
export const BINGO_COLUMNS = Object.freeze(["B", "I", "N", "G", "O"]);
export const BINGO_NUMBER_CEILING = 75;

/** The two letter cases a word board is set in. Uppercase is the classic card. */
export const BINGO_CASES = Object.freeze([
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
]);

/** Ready-made word lists, so a party host can print a whole set without typing a word. */
export const BINGO_THEMES = Object.freeze([
  { id: "sight-words", label: "Sight words", words: ["THE", "AND", "YOU", "THAT", "WAS", "FOR", "ARE", "WITH", "HIS", "THEY", "HAVE", "FROM", "ONE", "HAD", "WHAT", "WHEN", "YOUR", "SAID", "THERE", "EACH", "WHICH", "SHE", "HOW", "THEIR", "OUT", "ABOUT"] },
  { id: "animals", label: "Animals", words: ["ELEPHANT", "GIRAFFE", "PENGUIN", "DOLPHIN", "RABBIT", "TIGER", "MONKEY", "TURTLE", "ZEBRA", "PANDA", "KOALA", "OTTER", "LION", "HORSE", "SHEEP", "GOOSE", "MOUSE", "WHALE", "SHARK", "CAMEL", "DONKEY", "BEAVER", "BADGER", "FERRET", "IGUANA", "PARROT"] },
  { id: "baby-shower", label: "Baby shower", words: ["BABY", "RATTLE", "BIB", "BOTTLE", "DIAPER", "STROLLER", "BLANKET", "PACIFIER", "CRIB", "ONESIE", "BOOTIES", "LULLABY", "NURSERY", "TEDDY", "CUDDLE", "GIGGLE", "GRANDMA", "GRANDPA", "AUNTIE", "UNCLE", "COUSIN", "SPRINKLE", "SHOWER", "NEWBORN", "FAMILY", "BASSINET"] },
  { id: "halloween", label: "Halloween", words: ["PUMPKIN", "GHOST", "WITCH", "SPIDER", "CANDY", "SKELETON", "VAMPIRE", "OCTOBER", "COSTUME", "BAT", "MUMMY", "CAULDRON", "HAUNTED", "GOBLIN", "ZOMBIE", "WEREWOLF", "COBWEB", "POTION", "LANTERN", "SCARECROW", "TRICK", "TREAT", "MASK", "BROOMSTICK", "GRAVEYARD", "SPOOKY"] },
  { id: "christmas", label: "Christmas", words: ["SANTA", "REINDEER", "SNOWMAN", "STOCKING", "PRESENT", "MISTLETOE", "GINGERBREAD", "ORNAMENT", "HOLLY", "CAROL", "SLEIGH", "ELF", "CANDLE", "WREATH", "CHIMNEY", "TINSEL", "NUTCRACKER", "FIREPLACE", "JINGLE", "COCOA", "ANGEL", "STAR", "RIBBON", "SNOWY", "BELLS", "FROST"] },
  { id: "summer", label: "Summer", words: ["SUNSHINE", "BEACH", "POPSICLE", "SANDCASTLE", "SEASHELL", "VACATION", "POOL", "OCEAN", "PICNIC", "CAMPING", "SUNSCREEN", "ICECREAM", "LEMONADE", "SPRINKLER", "WATERMELON", "FLIPFLOPS", "SWIMSUIT", "SEASIDE", "HAMMOCK", "BARBECUE", "FIREFLY", "STARFISH", "SANDALS", "SUNGLASSES", "ROADTRIP", "GARDEN"] },
  { id: "food", label: "Food", words: ["PIZZA", "PASTA", "BURGER", "SALAD", "TACOS", "SUSHI", "PANCAKE", "WAFFLE", "MUFFIN", "COOKIE", "BROWNIE", "POPCORN", "CHEESE", "TOMATO", "CARROT", "POTATO", "BANANA", "ORANGE", "GRAPES", "CHERRY", "HONEY", "BUTTER", "NOODLE", "DUMPLING", "LASAGNA", "SMOOTHIE"] },
  { id: "sports", label: "Sports", words: ["SOCCER", "TENNIS", "BASEBALL", "BASKETBALL", "SWIMMING", "RUNNING", "CYCLING", "HOCKEY", "VOLLEYBALL", "SKATING", "BOXING", "GOLF", "RUGBY", "CRICKET", "SURFING", "SKIING", "ARCHERY", "FENCING", "ROWING", "BADMINTON", "NETBALL", "BOWLING", "DARTS", "KARATE", "JUDO", "SOFTBALL"] },
  { id: "travel", label: "Travel", words: ["PASSPORT", "LUGGAGE", "AIRPORT", "AIRPLANE", "HOTEL", "SUITCASE", "BOARDING", "TICKET", "JOURNEY", "HOLIDAY", "TOURIST", "POSTCARD", "CAMERA", "COMPASS", "MAP", "MUSEUM", "CASTLE", "ISLAND", "HARBOUR", "RAILWAY", "TAXI", "VISA", "CUSTOMS", "RESORT", "SIGHTSEE", "BACKPACK"] },
  { id: "space", label: "Space", words: ["ROCKET", "PLANET", "SATURN", "METEOR", "GALAXY", "ORBIT", "COMET", "NEBULA", "ASTEROID", "ASTRONAUT", "MOON", "STAR", "MARS", "VENUS", "JUPITER", "MERCURY", "NEPTUNE", "URANUS", "PLUTO", "SATELLITE", "TELESCOPE", "GRAVITY", "ECLIPSE", "COSMOS", "SHUTTLE", "LAUNCH"] },
]);

/** The most cards one set carries, so a class of thirty each get their own sheet. */
export const BINGO_MAX_CARDS = 30;
/** A card cell holds a short entry; anything longer is trimmed so the grid stays readable. */
export const BINGO_WORD_MAX = 16;
export const BINGO_WORD_LIMIT = 36;
/** The safe printer border, the gap between two cards and the widest a card is ever printed. */
export const BINGO_MARGIN_CM = 1.0;
export const BINGO_GAP_CM = 0.5;
export const BINGO_CARD_MAX_CM = 16;
/** Card shape as width divided by height, which is the tall rectangle a printed card uses. */
export const BINGO_CARD_ASPECT = 0.78;


/**
 * A printable chore chart. The chart is drawn rather than uploaded, so the paper, the day columns
 * and the chore rows are the whole recipe, and the same geometry drives the live preview and the
 * 300 DPI download. Every measurement is in centimetres so print matches the screen.
 */
export const CHART_PAPERS = Object.freeze([
  { id: "letter", widthCm: 21.59, heightCm: 27.94, short: "US Letter", label: "US Letter (8.5 x 11 in)" },
  { id: "a4", widthCm: 21, heightCm: 29.7, short: "A4", label: "A4 (21 x 29.7 cm)" },
]);

/** How much of the week the chart covers. A seven day week suits a holiday routine, five days a
 *  school term. */
export const CHART_DAYS = Object.freeze([
  { id: "week", label: "Monday to Sunday", short: "Mon to Sun", names: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] },
  { id: "school", label: "Monday to Friday", short: "Mon to Fri", names: ["MON", "TUE", "WED", "THU", "FRI"] },
  { id: "school-sat", label: "Monday to Saturday", short: "Mon to Sat", names: ["MON", "TUE", "WED", "THU", "FRI", "SAT"] },
]);

/** What sits in each square. A tick is quickest, a star is the reward a young child wants, and
 *  plain rows leave the chart open to a sticker or a drawing. */
export const CHART_STYLES = Object.freeze([
  { id: "tick", label: "Tick boxes" },
  { id: "star", label: "Colour-in stars" },
  { id: "plain", label: "Plain rows" },
]);

/** Colour kits, so the child who owns the chart gets to pick the one that goes on the fridge. */
export const CHART_THEMES = Object.freeze([
  { id: "rainbow", label: "Rainbow", head: "#33415c", accent: "#e4572e", band: "#ffe6d5", row: "#fffaf5" },
  { id: "ocean", label: "Ocean", head: "#12556b", accent: "#1b9aaa", band: "#d7f0f5", row: "#f5fcfd" },
  { id: "forest", label: "Forest", head: "#2d4739", accent: "#4c956c", band: "#dcece1", row: "#f7fbf8" },
  { id: "sunshine", label: "Sunshine", head: "#7a5300", accent: "#f0a202", band: "#ffeeb8", row: "#fffcf3" },
  { id: "berry", label: "Berry", head: "#5a1f3d", accent: "#b23a6b", band: "#f6dbe6", row: "#fdf7fa" },
  { id: "space", label: "Space", head: "#232946", accent: "#5c6bc0", band: "#dde0f5", row: "#f8f9fe" },
  { id: "pastel", label: "Pastel", head: "#4a4458", accent: "#a78bcd", band: "#ece4f7", row: "#fbf9fe" },
  { id: "mono", label: "Black and white", head: "#1f2429", accent: "#5b6470", band: "#e6e9ed", row: "#fafafa" },
]);

/** A chart is read at a glance, so one row is one short instruction and nothing more. */
export const CHART_MAX_ROWS = 14;
export const CHART_MIN_ROWS = 3;
export const CHART_ROW_LIMIT = 24;
export const CHART_CHORE_MAX = 30;
/** The safe printer border, and the longest a printed title, name or reward line may run. */
export const CHART_MARGIN_CM = 1.1;
export const CHART_TITLE_MAX = 34;
export const CHART_NAME_MAX = 18;
export const CHART_REWARD_MAX = 34;

/** A ready-made week, so the first chart on screen is already a usable one. */
export const CHART_SAMPLE = Object.freeze([
  "Make my bed",
  "Brush my teeth",
  "Get dressed",
  "Pack my school bag",
  "Tidy my room",
  "Feed the pet",
  "Set the table",
  "Read for 20 minutes",
]);


/**
 * A printable multiplication chart. One grid of products covers the whole family of requests -
 * the 1 to 10 chart that stops at 100, the 1 to 12 chart every classroom uses, the 1 to 20 poster -
 * and the same geometry draws the preview and the 300 DPI download.
 */
export const MUL_TYPES = Object.freeze([
  { id: "grid", label: "Multiplication chart grid" },
  { id: "tables", label: "Times tables, written out" },
]);

/** How far the chart runs. The 1 to 10 grid is the chart whose answers stop at 100. */
export const MUL_RANGES = Object.freeze([
  { id: "10", max: 10, label: "1 to 10 - answers up to 100" },
  { id: "12", max: 12, label: "1 to 12" },
  { id: "15", max: 15, label: "1 to 15" },
  { id: "20", max: 20, label: "1 to 20" },
]);

/** How much of the answer key is printed, so one sheet covers both a chart and its practice copy. */
export const MUL_FILLS = Object.freeze([
  { id: "full", label: "Print every answer" },
  { id: "partial", label: "Half printed - fill in the rest" },
  { id: "blank", label: "Blank - no answers" },
]);

/** The diagonal of square numbers is the first shortcut most children are taught. */
export const MUL_SQUARES = Object.freeze([
  { id: "on", label: "Highlight square numbers" },
  { id: "off", label: "Plain squares" },
]);

export const MUL_ORIENTS = Object.freeze([
  { id: "portrait", label: "Portrait" },
  { id: "landscape", label: "Landscape" },
]);

/** The safe printer border, and the longest a printed title or name may run. */
export const MUL_MARGIN_CM = 1.1;
export const MUL_TITLE_MAX = 34;
export const MUL_NAME_MAX = 18;
/** A written-out times table stops here, because 400 facts on one sheet stop being readable. */
export const MUL_TABLES_MAX = 12;
/** A digit is read at arm's length, so no cell is ever allowed to print smaller than this. */
export const MUL_MIN_CELL_CM = 0.6;

/** A ready-made chart, so a useful sheet is already on screen before anything is typed. */
export const MUL_SAMPLE = Object.freeze({
  title: "My times tables",
  name: "Alex",
  max: "12",
  type: "grid",
  fill: "full",
  squares: "on",
});


/**
 * A printable paper crown. The band is drawn at the real paper size, so the same geometry lays
 * out the preview and the 300 DPI download: two bands to a landscape sheet, a cutting outline
 * around the points, and a glue tab at the end of each band.
 */
export const CROWN_STYLES = Object.freeze([
  { id: "king", label: "King - sharp points" },
  { id: "queen", label: "Queen - arches and pearls" },
  { id: "princess", label: "Princess - hearts" },
  { id: "birthday", label: "Birthday - scallops" },
  { id: "plain", label: "Plain - simple zigzag" },
]);

/** How deep the band is. A deeper band carries a longer name and sits further down the forehead. */
export const CROWN_BANDS = Object.freeze([
  { id: "slim", label: "Slim band", bodyCm: 3.2, teethCm: 2.9 },
  { id: "classic", label: "Classic band", bodyCm: 4, teethCm: 3.6 },
  { id: "wide", label: "Tall band", bodyCm: 4.8, teethCm: 4.2 },
]);

/** The safe printer border, and the longest name that fits on the front of a band. */
export const CROWN_MARGIN_CM = 1.1;
export const CROWN_NAME_MAX = 22;
/** Two bands to a sheet: one sheet is a child-sized crown, two sheets cover most adults. */
export const CROWN_PER_SHEET = 2;
/** The overlap that gets glued or taped behind the next band. */
export const CROWN_TAB_CM = 1.7;
/** A point is cut out with scissors, so no point is ever drawn narrower than this. */
export const CROWN_TOOTH_CM = 3.5;
/** The smallest gap between two bands, which keeps the cut line clear of its neighbour. */
export const CROWN_MIN_GAP_CM = 0.8;

/** A ready-made crown, so a finished band is already on screen before anything is typed. */
export const CROWN_SAMPLE = Object.freeze({
  name: "Amelia",
  style: "queen",
  band: "classic",
});


const PROFILES = Object.freeze([
  { id: "keychain", name: "Pet Keychain Maker", product: "Acrylic keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [4, 5, 6] },
  { id: "standee", name: "Acrylic Standee Maker", product: "Acrylic standee", hasHardware: false, hasBase: true, exportSvg: false, sizes: [8, 10, 15] },
  { id: "sticker", name: "Sticker Cutline Generator", product: "Die-cut sticker", hasHardware: false, hasBase: false, exportSvg: true, sizes: [5, 7, 10] },
  { id: "magnet", name: "Fridge Magnet Maker", product: "Fridge magnet", hasHardware: false, hasBase: false, exportSvg: false, sizes: [5, 7, 9] },
  { id: "photo-keychain", name: "Photo Keychain Maker", product: "Acrylic photo keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [4, 5, 6] },
  { id: "name-keychain", name: "Name Keychain Maker", product: "Acrylic name keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [5, 7, 9] },
  { id: "ornament", name: "Photo Ornament Maker", product: "Photo ornament", hasHardware: true, hasBase: false, exportSvg: true, sizes: [6, 8, 10] },
  { id: "block", name: "Acrylic Photo Block Maker", product: "Acrylic photo block", hasHardware: false, hasBase: false, exportSvg: false, sizes: PHOTO_BLOCK_SIZES.map((size) => size.heightCm), sizeLabels: PHOTO_BLOCK_SIZES.map((size) => size.label) },
  { id: "luggage-tag", name: "Luggage Tag Maker", product: "Acrylic luggage tag", hasHardware: false, hasBase: false, exportSvg: true, sizes: LUGGAGE_TAG_SIZES },
  { id: "pet-tag", name: "Pet ID Tag Maker", product: "Acrylic pet ID tag", hasHardware: false, hasBase: false, exportSvg: true, sizes: PET_TAG_SIZES, sizeLabels: ["Small (3 cm)", "Medium (4 cm)", "Large (5 cm)"] },
  { id: "cake-topper", name: "Cake Topper Maker", product: "Acrylic cake topper", hasHardware: false, hasBase: false, exportSvg: true, sizes: CAKE_TOPPER_SIZES },
  { id: "cupcake", name: "Cupcake Topper Maker", product: "Printable cupcake topper", hasHardware: false, hasBase: false, exportSvg: false, sizes: CUPCAKE_TOPPER_SIZES.map((size) => size.widthCm), sizeLabels: CUPCAKE_TOPPER_SIZES.map((size) => size.label) },
  { id: "bookmark", name: "Bookmark Maker", product: "Acrylic bookmark", hasHardware: false, hasBase: false, exportSvg: true, sizes: BOOKMARK_SIZES },
  { id: "coaster", name: "Acrylic Coaster Maker", product: "Acrylic coaster", hasHardware: false, hasBase: false, exportSvg: true, sizes: COASTER_SIZES },
  { id: "name-plate", name: "Desk Name Plate Maker", product: "Acrylic desk name plate", hasHardware: false, hasBase: false, exportSvg: true, sizes: DESK_NAME_PLATE_SIZES.map((size) => size.widthCm), sizeLabels: DESK_NAME_PLATE_SIZES.map((size) => size.label) },
  { id: "jigsaw", name: "Photo Jigsaw Puzzle Maker", product: "Photo jigsaw puzzle", hasHardware: false, hasBase: false, exportSvg: true, sizes: JIGSAW_PUZZLE_SIZES },
  { id: "sticker-outline", name: "Sticker Outline Maker", product: "Sticker with a printed border", hasHardware: false, hasBase: false, exportSvg: true, sizes: STICKER_OUTLINE_SIZES },
  { id: "photo-strip", name: "Photo Strip Maker", product: "Photo booth strip", hasHardware: false, hasBase: false, exportSvg: false, sizes: PHOTO_STRIP_SIZES.map((size) => size.widthCm), sizeLabels: PHOTO_STRIP_SIZES.map((size) => size.label) },
  { id: "table-number", name: "Table Number Maker", product: "Wedding table number", hasHardware: false, hasBase: false, exportSvg: false, sizes: TABLE_NUMBER_SIZES.map((size) => size.widthCm), sizeLabels: TABLE_NUMBER_SIZES.map((size) => size.label) },
  { id: "polaroid", name: "Polaroid Frame Maker", product: "Polaroid photo frame", hasHardware: false, hasBase: false, exportSvg: false, sizes: POLAROID_FRAMES.map((frame) => frame.widthCm), sizeLabels: POLAROID_FRAMES.map((frame) => frame.label) },
  { id: "place-card", name: "Place Card Maker", product: "Printable place card", hasHardware: false, hasBase: false, exportSvg: false, sizes: PLACE_CARD_SHEETS.map((sheet) => sheet.widthCm), sizeLabels: PLACE_CARD_SHEETS.map((sheet) => sheet.label) },
  { id: "coloring", name: "Photo to Coloring Page Maker", product: "Coloring page", hasHardware: false, hasBase: false, exportSvg: false, sizes: ["letter", "a4"], sizeLabels: ["US Letter (8.5 x 11 in)", "A4 (21 x 29.7 cm)"] },
  { id: "gift-tag", name: "Gift Tag Maker", product: "Printable gift tag", hasHardware: false, hasBase: false, exportSvg: false, sizes: GIFT_TAG_SIZES.map((size) => size.widthCm), sizeLabels: GIFT_TAG_SIZES.map((size) => size.label) },
  { id: "name-tracing", name: "Name Tracing Worksheet Maker", product: "Name tracing worksheet", hasHardware: false, hasBase: false, exportSvg: false, sizes: NAME_TRACING_PAPERS.map((paper) => paper.widthCm), sizeLabels: NAME_TRACING_PAPERS.map((paper) => paper.label) },
  { id: "bingo", name: "Bingo Card Maker", product: "Printable bingo cards", hasHardware: false, hasBase: false, exportSvg: false, sizes: BINGO_PAPERS.map((paper) => paper.widthCm), sizeLabels: BINGO_PAPERS.map((paper) => paper.label) },
  { id: "chore-chart", name: "Chore Chart Maker", product: "Printable chore chart", hasHardware: false, hasBase: false, exportSvg: false, sizes: CHART_PAPERS.map((paper) => paper.widthCm), sizeLabels: CHART_PAPERS.map((paper) => paper.label) },
  { id: "multiplication-chart", name: "Multiplication Chart Maker", product: "Printable multiplication chart", hasHardware: false, hasBase: false, exportSvg: false, sizes: CHART_PAPERS.map((paper) => paper.widthCm), sizeLabels: CHART_PAPERS.map((paper) => paper.label) },
  { id: "crown-maker", name: "Crown Maker", product: "Printable paper crown", hasHardware: false, hasBase: false, exportSvg: false, sizes: CHART_PAPERS.map((paper) => paper.widthCm), sizeLabels: CHART_PAPERS.map((paper) => paper.label) },
  { id: "word-search", name: "Word Search Maker", product: "Printable word search puzzle", hasHardware: false, hasBase: false, exportSvg: false, sizes: WORD_SEARCH_PAPERS.map((paper) => paper.widthCm), sizeLabels: WORD_SEARCH_PAPERS.map((paper) => paper.label) },
]);

export const PRINT_DPI = 300;

// ---------------------------------------------------------------- product config

export function listProductProfiles() {
  return PROFILES;
}

export function getProductProfile(id) {
  const profile = PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown product profile: ${id}`);
  return profile;
}

/** The photo block product sizes, looked up by the long side the size picker stores. */
export function photoBlockSize(value) {
  const cm = Number(value);
  return PHOTO_BLOCK_SIZES.find((size) => Math.abs(size.heightCm - cm) < 0.02) || PHOTO_BLOCK_SIZES[0];
}

/** The photo strip format, looked up by the printed width the size picker stores. */
export function photoStripSize(value) {
  const cm = Number(value);
  return PHOTO_STRIP_SIZES.find((size) => Math.abs(size.widthCm - cm) < 0.02) || PHOTO_STRIP_SIZES[0];
}

/** How many photos one strip is split into, clamped to the two layouts the tool offers. */
export function photoStripCount(value) {
  return Number(value) === PHOTO_STRIP_COUNTS[0] ? PHOTO_STRIP_COUNTS[0] : PHOTO_STRIP_COUNTS[1];
}

/** The table number format, looked up by the printed width the size picker stores. */
export function tableNumberSize(value) {
  const cm = Number(value);
  return TABLE_NUMBER_SIZES.find((size) => Math.abs(size.widthCm - cm) < 0.02) || TABLE_NUMBER_SIZES[0];
}

/** The card silhouette, falling back to the arch that most table numbers are searched for. */
export function tableNumberShape(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return TABLE_NUMBER_SHAPES.includes(raw) ? raw : TABLE_NUMBER_SHAPES[0];
}

/** A usable hex colour for the printed card stock, falling back to white. */
export function tableNumberPaperHex(value) {
  return readHexColour(value, TABLE_NUMBER_PAPERS, "#ffffff");
}

/** The sheet a place card is printed on, looked up by the width the size picker stores. */
export function placeCardSheet(value) {
  const cm = Number(value);
  return PLACE_CARD_SHEETS.find((sheet) => Math.abs(sheet.widthCm - cm) < 0.02) || PLACE_CARD_SHEETS[0];
}

/** The card style, falling back to the folded tent that most place cards are. */
export function placeCardStyle(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return PLACE_CARD_STYLES.includes(raw) ? raw : PLACE_CARD_STYLES[0];
}

/** A usable hex colour for the printed card stock, falling back to white. */
export function placeCardPaperHex(value) {
  return readHexColour(value, PLACE_CARD_PAPERS, "#ffffff");
}

/** The meal a guest line asked for, matched on the words people actually type after a comma. */
export function placeCardMeal(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  if (!raw) return "";
  const meal = PLACE_CARD_MEALS.find((entry) => entry.words.some((word) => raw.includes(word)));
  return meal ? meal.id : "";
}

/**
 * The card grid for a sheet. The preview and the print both read it, so the number of cards on
the page and where the cut lines fall can never drift apart.
 */
export function placeCardGrid(sheetValue, styleValue) {
  const sheet = placeCardSheet(sheetValue);
  const style = placeCardStyle(styleValue);
  const card = PLACE_CARD_FOOTPRINTS[style];
  const usableW = Math.max(card.widthCm, sheet.widthCm - PLACE_CARD_MARGIN_CM * 2);
  const usableH = Math.max(card.heightCm, sheet.heightCm - PLACE_CARD_MARGIN_CM * 2);
  const cols = Math.max(1, Math.floor((usableW + 0.02) / card.widthCm));
  const rows = Math.max(1, Math.floor((usableH + 0.02) / card.heightCm));
  return Object.freeze({ sheet, style, card, cols, rows, perSheet: cols * rows, marginCm: PLACE_CARD_MARGIN_CM });
}

/**
 * Splits a pasted guest list into the names and the meal each line asked for. Blank lines drop
out, a trailing ", beef" or "| beef" becomes that guest's meal, and the order is kept so the
printed sheet reads exactly like the list the couple typed.
 */
export function placeCardGuests(value, limit = PLACE_CARD_LIMIT) {
  const asked = Number(limit);
  const cap = Number.isFinite(asked) && asked > 0 ? Math.floor(asked) : PLACE_CARD_LIMIT;
  const guests = [];
  const lines = String(value === undefined || value === null ? "" : value).split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.replace(/\s+/g, " ").trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/\s*[,|]\s*/);
    const name = (parts.shift() || "").trim().slice(0, 36);
    if (!name) continue;
    guests.push({ name, meal: placeCardMeal(parts.join(" ")) });
    if (guests.length >= cap) break;
  }
  return guests;
}

/** The instant film format, looked up by the width the size picker stores. */
export function polaroidFrame(value) {
  const cm = Number(value);
  return POLAROID_FRAMES.find((frame) => Math.abs(frame.widthCm - cm) < 0.02) || POLAROID_FRAMES[0];
}

/** A usable hex colour for the film itself, falling back to the classic white frame. */
export function polaroidPaperHex(value) {
  return readHexColour(value, POLAROID_PAPERS, "#ffffff");
}

/** The look the photo is graded with, falling back to the untouched original. */
export function polaroidFinish(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return POLAROID_FINISHES.find((finish) => finish.id === raw) || POLAROID_FINISHES[0];
}

/** The printable sheet a run of frames is tiled onto, or null when the download is one frame. */
export function polaroidSheet(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return POLAROID_SHEETS.find((sheet) => sheet.id === raw) || null;
}

/**
 * How many frames tile onto one sheet. The preview and the print both read this, so the grid on
 * screen and the frames that come off the printer can never drift apart.
 */
export function polaroidGrid(sheetValue, frameValue) {
  const sheet = polaroidSheet(sheetValue) || POLAROID_SHEETS[0];
  const frame = polaroidFrame(frameValue);
  const usableW = Math.max(frame.widthCm, sheet.widthCm - POLAROID_MARGIN_CM * 2);
  const usableH = Math.max(frame.heightCm, sheet.heightCm - POLAROID_MARGIN_CM * 2);
  const cols = Math.max(1, Math.floor((usableW + POLAROID_GUTTER_CM) / (frame.widthCm + POLAROID_GUTTER_CM)));
  const rows = Math.max(1, Math.floor((usableH + POLAROID_GUTTER_CM) / (frame.heightCm + POLAROID_GUTTER_CM)));
  return Object.freeze({ sheet, frame, cols, rows, perSheet: cols * rows, marginCm: POLAROID_MARGIN_CM, gutterCm: POLAROID_GUTTER_CM });
}

/** The round topper diameter, looked up by the centimetre value the size picker stores. */
export function cupcakeTopper(value) {
  const cm = Number(value);
  return CUPCAKE_TOPPER_SIZES.find((size) => Math.abs(size.widthCm - cm) < 0.02) || CUPCAKE_TOPPER_SIZES[0];
}

/** The craft-knife silhouette, falling back to the classic circle. */
export function cupcakeShape(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return CUPCAKE_SHAPES.includes(raw) ? raw : CUPCAKE_SHAPES[0];
}

/** The printable sheet a run of toppers is tiled onto, or null for one standalone topper. */
export function cupcakeSheet(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return CUPCAKE_SHEETS.find((sheet) => sheet.id === raw) || null;
}

/** A usable card colour for the topper itself, falling back to clean white. */
export function cupcakePaperHex(value) {
  return readHexColour(value, CUPCAKE_PAPERS, "#ffffff");
}

/**
 * How many toppers fit on one sheet. The same function drives the on-screen sheet and the
 * download, so the cut line and the printer output cannot drift apart.
 */
export function cupcakeGrid(sheetValue, topperValue) {
  const sheet = cupcakeSheet(sheetValue) || CUPCAKE_SHEETS[0];
  const topper = cupcakeTopper(topperValue);
  const usableW = Math.max(topper.widthCm, sheet.widthCm - CUPCAKE_MARGIN_CM * 2);
  const usableH = Math.max(topper.heightCm, sheet.heightCm - CUPCAKE_MARGIN_CM * 2);
  const cols = Math.max(1, Math.floor((usableW + CUPCAKE_GUTTER_CM) / (topper.widthCm + CUPCAKE_GUTTER_CM)));
  const rows = Math.max(1, Math.floor((usableH + CUPCAKE_GUTTER_CM) / (topper.heightCm + CUPCAKE_GUTTER_CM)));
  return Object.freeze({ sheet, topper, cols, rows, perSheet: cols * rows, marginCm: CUPCAKE_MARGIN_CM, gutterCm: CUPCAKE_GUTTER_CM });
}

/** The tag footprint, looked up by the centimetre value the size picker stores. */
export function giftTagSize(value) {
  const cm = Number(value);
  return GIFT_TAG_SIZES.find((size) => Math.abs(size.widthCm - cm) < 0.02) || GIFT_TAG_SIZES[0];
}

/** The craft-knife silhouette, falling back to the classic tag profile. */
export function giftTagShape(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return GIFT_TAG_SHAPES.includes(raw) ? raw : GIFT_TAG_SHAPES[0];
}

/** The printable sheet a run of tags is tiled onto, or null for one standalone tag. */
export function giftTagSheet(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return GIFT_TAG_SHEETS.find((sheet) => sheet.id === raw) || null;
}

/** A usable card colour for the tag itself, falling back to clean white. */
export function giftTagPaperHex(value) {
  return readHexColour(value, GIFT_TAG_PAPERS, "#ffffff");
}

/**
 * How many tags fit on one sheet. The same function drives the on-screen sheet and the
 * download, so the guide lines and the printer output cannot drift apart.
 */
export function giftTagGrid(sheetValue, tagValue) {
  const sheet = giftTagSheet(sheetValue) || GIFT_TAG_SHEETS[0];
  const tag = giftTagSize(tagValue);
  const usableW = Math.max(tag.widthCm, sheet.widthCm - GIFT_TAG_MARGIN_CM * 2);
  const usableH = Math.max(tag.heightCm, sheet.heightCm - GIFT_TAG_MARGIN_CM * 2);
  const cols = Math.max(1, Math.floor((usableW + GIFT_TAG_GUTTER_CM) / (tag.widthCm + GIFT_TAG_GUTTER_CM)));
  const rows = Math.max(1, Math.floor((usableH + GIFT_TAG_GUTTER_CM) / (tag.heightCm + GIFT_TAG_GUTTER_CM)));
  return Object.freeze({ sheet, tag, cols, rows, perSheet: cols * rows, marginCm: GIFT_TAG_MARGIN_CM, gutterCm: GIFT_TAG_GUTTER_CM });
}

/**
 * The eyelet every gift tag hangs from: the centre it is punched at and its radius, measured in
 * a local box that starts at the tag's top-left corner. A tag is taller than it is wide, so the
 * hole is seated near the top edge and never drifts into the message once the size changes.
 */
export function giftTagHole(width, height) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Gift tag width and height must be positive.");
  const unit = Math.min(w, h);
  const r = Math.max(3, unit * 0.065);
  const cy = Math.max(r + unit * 0.045, unit * 0.135);
  return Object.freeze({ cx: w / 2, cy, r: Math.round(r * 100) / 100 });
}

/** The paper a worksheet is printed on, looked up by the width the size picker stores. */
export function nameTracingPaper(value) {
  const cm = Number(value);
  return NAME_TRACING_PAPERS.find((paper) => Math.abs(paper.widthCm - cm) < 0.02) || NAME_TRACING_PAPERS[0];
}

/** The practice-row style, falling back to the classic dotted outline. */
export function nameTracingStyle(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return NAME_TRACING_STYLES.find((style) => style.id === raw) || NAME_TRACING_STYLES[0];
}

/** The ruled line set, falling back to blue-red-blue school paper. */
export function nameTracingRule(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return NAME_TRACING_RULES.find((rule) => rule.id === raw) || NAME_TRACING_RULES[0];
}

/** The letter case, falling back to printing the name exactly as it was typed. */
export function nameTracingCase(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return NAME_TRACING_CASES.find((entry) => entry.id === raw) || NAME_TRACING_CASES[0];
}

/** A usable pencil colour, falling back to graphite. */
export function nameTracingInkHex(value) {
  return readHexColour(value, NAME_TRACING_INKS, "#4a5250");
}

/**
 * Applies the chosen case to a name. Nothing is changed unless the visitor asked for it, because
 * "McKenzie" and "van der Berg" should print the way the family writes them.
 */
export function nameTracingText(name, caseValue) {
  const text = String(name === undefined || name === null ? "" : name).replace(/\s+/g, " ").trim();
  const raw = caseValue && typeof caseValue === "object" && caseValue.id !== undefined
    ? caseValue.id
    : caseValue;
  const chosen = String(raw === undefined || raw === null ? "" : raw).trim().toLowerCase();
  if (chosen === "upper") return text.toUpperCase();
  if (chosen === "lower") return text.toLowerCase();
  if (chosen === "title") {
    return text.toLowerCase().replace(/(^|[\s'-])([a-z])/g, (whole, separator, letter) => separator + letter.toUpperCase());
  }
  return text;
}

/**
 * Splits the name box into one name per line. A parent gets a single worksheet, and a teacher
 * who pastes a class list gets one page per child in the order the register reads.
 */
export function nameTracingNames(value, limit = NAME_TRACING_LIMIT) {
  const asked = Number(limit);
  const cap = Number.isFinite(asked) && asked > 0 ? Math.floor(asked) : NAME_TRACING_LIMIT;
  const names = [];
  const lines = String(value === undefined || value === null ? "" : value).split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.replace(/\s+/g, " ").trim().slice(0, 24);
    if (!trimmed) continue;
    names.push(trimmed);
    if (names.length >= cap) break;
  }
  return names;
}

/**
 * How many copies of the name fit along one writing line and how wide each slot is. The caller
 * measures the name once and this returns the count, so the row on screen and the row on the
 * printed page can never disagree about how many names are on the line.
 */
export function nameTracingSlots(usableW, unitW, max = 8) {
  const width = Number(usableW);
  const unit = Number(unitW);
  if (!Number.isFinite(width) || width <= 0) throw new Error("Usable width must be positive.");
  if (!Number.isFinite(unit) || unit <= 0) throw new Error("Unit width must be positive.");
  const asked = Number(max);
  const ceiling = Number.isFinite(asked) && asked >= 1 ? Math.floor(asked) : 1;
  const count = Math.max(1, Math.min(ceiling, Math.floor((width + 0.0001) / unit)));
  return Object.freeze({ count, slotW: width / count });
}

/** Rounds a row count into the range the worksheet can actually print. */
function nameTracingCount(value, min, max, fallback) {
  const asked = Number(value);
  if (!Number.isFinite(asked)) return fallback;
  return Math.max(min, Math.min(max, Math.round(asked)));
}

/**
 * The ruled block a worksheet is built from: how wide the writing lines are, how many rows of
 * each kind there are and how tall one row is. The preview and the 300 DPI print both read
 * this, so a row never moves between the screen and the paper.
 */
export function nameTracingSheet(options) {
  const opts = options || {};
  const paper = nameTracingPaper(opts.paper);
  const practiceRows = nameTracingCount(opts.rows, NAME_TRACING_ROW_MIN, NAME_TRACING_ROW_MAX, 5);
  const blankRows = nameTracingCount(opts.blankRows, 0, NAME_TRACING_BLANK_MAX, 1);
  const guideRows = opts.guide === false ? 0 : 1;
  const headerRows = opts.header === false ? 0 : 1;
  const marginCm = NAME_TRACING_MARGIN_CM;
  const headerCm = headerRows ? NAME_TRACING_HEADER_CM : 0;
  const usableW = Math.max(2, paper.widthCm - marginCm * 2);
  const usableH = Math.max(2, paper.heightCm - marginCm * 2 - headerCm);
  const totalRows = Math.max(1, practiceRows + blankRows + guideRows);
  const bandCm = Math.min(NAME_TRACING_BAND_MAX_CM, usableH / totalRows);
  const lineCm = bandCm * 0.76;
  return Object.freeze({
    paper,
    marginCm,
    headerCm,
    headerRows,
    guideRows,
    practiceRows,
    blankRows,
    totalRows,
    usableW,
    usableH,
    bandCm,
    padCm: bandCm * 0.12,
    lineCm,
    midCm: lineCm / 2,
    blockCm: bandCm * totalRows,
  });
}

/** The desk name plate sizes, looked up by the long side the size picker stores. */
export function deskNamePlateSize(value) {
  const cm = Number(value);
  return DESK_NAME_PLATE_SIZES.find((size) => Math.abs(size.widthCm - cm) < 0.02) || DESK_NAME_PLATE_SIZES[0];
}

/** Size dropdown label: photo blocks read in inches, every other product reads in cm. */
export function sizeOptionLabel(profile, longSideCm) {
  // Sizes are centimetres for every product except the colouring page, which picks a paper, so
  // the lookup compares as text instead of coercing a paper id into a broken number.
  const index = profile.sizes.findIndex((size) => String(size) === String(longSideCm));
  const labels = profile.sizeLabels;
  if (index >= 0 && labels && labels[index]) return labels[index];
  return longSideCm + " cm long side";
}
export function physicalDimensions(width, height, longSideCm) {
  const safeWidth = Number(width), safeHeight = Number(height), longSide = Number(longSideCm);
  if (!(safeWidth > 0 && safeHeight > 0 && longSide > 0)) throw new Error("Image dimensions and long side must be positive.");
  const ratio = longSide / Math.max(safeWidth, safeHeight);
  return { widthCm: round(safeWidth * ratio), heightCm: round(safeHeight * ratio) };
}

export function stickerOffsetPixels(millimeters, dpi = PRINT_DPI) {
  const value = Number(millimeters), safeDpi = Number(dpi);
  if (!(value >= 0 && safeDpi > 0)) throw new Error("Offset and DPI must be valid.");
  return Math.round(value / 25.4 * safeDpi);
}

export function normalizeCutlineSmoothing(value) {
  return Math.max(0, Math.min(10, Math.round(Number(value) || 0)));
}

/**
 * The border width a visitor asked for, in millimetres. Anything outside the printable range
 * is pulled back in rather than thrown away, so a hand-typed query string still renders.
 */
export function stickerBorderWidth(millimetres) {
  const value = Number(millimetres);
  if (!Number.isFinite(value)) return 2;
  return Math.max(1, Math.min(10, Math.round(value * 2) / 2));
}

/** A usable hex colour for the border, falling back to white on anything unrecognised. */
export function stickerBorderHex(value) {
  return readHexColour(value, STICKER_BORDER_PRESETS, "#ffffff");
}

/** A usable hex colour for the printed strip paper, falling back to white. */
export function photoStripPaperHex(value) {
  return readHexColour(value, PHOTO_STRIP_PAPERS, "#ffffff");
}

/**
 * Black or white type, whichever stays readable on the given background. The strip caption
 * changes colour with the paper, so a black strip never ships with black type on it.
 */
export function readableInk(value) {
  const hex = photoStripPaperHex(value);
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance < 0.55 ? "#ffffff" : "#1d2420";
}

/** A hex value, a short hex value or a preset name resolved against a preset list. */
function readHexColour(value, presets, fallback) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
  if (/^#[0-9a-f]{3}$/.test(raw)) return "#" + raw.slice(1).split("").map((ch) => ch + ch).join("");
  const preset = presets.find((entry) => entry.id === raw);
  return preset ? preset.hex : fallback;
}

/** Physical longest side in centimetres -> whole pixels at a print DPI. */
export function physicalPixels(longSideCm, dpi = PRINT_DPI) {
  const cm = Number(longSideCm), safeDpi = Number(dpi);
  if (!(cm > 0 && safeDpi > 0)) throw new Error("Long side and DPI must be positive.");
  return Math.max(1, Math.round(cm / 2.54 * safeDpi));
}

/** Effective DPI of a canvas that draws `pixelLongSide` pixels across `longSideCm`. */
export function workDpi(pixelLongSide, longSideCm) {
  const px = Number(pixelLongSide), cm = Number(longSideCm);
  if (!(px > 0 && cm > 0)) throw new Error("Pixel long side and physical long side must be positive.");
  return px / (cm / 2.54);
}

// ---------------------------------------------------------------- alpha -> mask

/** RGBA buffer -> binary alpha mask. 1 means "opaque enough to cut". */
export function alphaToMask(pixels, width, height, alphaThreshold = 24) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!(w > 0 && h > 0)) throw new Error("Mask dimensions must be positive.");
  if (!pixels || pixels.length < w * h * 4) throw new Error("Pixel buffer is smaller than the mask dimensions.");
  const threshold = Math.max(0, Math.min(255, Math.floor(Number(alphaThreshold) || 0)));
  const mask = new Uint8Array(w * h);
  for (let i = 0, p = 3; i < mask.length; i++, p += 4) mask[i] = pixels[p] > threshold ? 1 : 0;
  return mask;
}

// ------------------------------------------------------------- flat background lift

/** Largest per-channel difference between one pixel and a reference colour. */
function channelSpread(pixels, p, color) {
  return Math.max(
    Math.abs(pixels[p] - color[0]),
    Math.abs(pixels[p + 1] - color[1]),
    Math.abs(pixels[p + 2] - color[2]),
  );
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

/** Median colour of the outer one-pixel frame, and how much of that frame agrees with it. */
function backdropSample(pixels, w, h, tolerance) {
  const ring = [];
  for (let x = 0; x < w; x++) { ring.push(x); ring.push((h - 1) * w + x); }
  for (let y = 1; y < h - 1; y++) { ring.push(y * w); ring.push(y * w + w - 1); }
  const lists = [[], [], []];
  let clear = 0;
  for (const index of ring) {
    const p = index * 4;
    if (pixels[p + 3] <= 8) clear++;
    lists[0].push(pixels[p]);
    lists[1].push(pixels[p + 1]);
    lists[2].push(pixels[p + 2]);
  }
  const color = lists.map((list) => {
    list.sort((a, b) => a - b);
    return list[list.length >> 1];
  });
  let matches = 0;
  for (const index of ring) if (channelSpread(pixels, index * 4, color) <= tolerance) matches++;
  return { color, share: matches / ring.length, clearShare: clear / ring.length };
}

/**
 * Lifts a flat, evenly lit backdrop out of an otherwise opaque picture by writing zeros into the
 * alpha channel. A photo saved as JPEG has no transparency at all, so without this its outline
 * traces back as one big rectangle and the cut line never follows the subject. The untouched
 * buffer comes back when the border is too busy to be a backdrop (a real scene runs to every
 * edge), when the picture already carries transparency, or when the backdrop would swallow it.
 */
export function stripFlatBackground(pixels, width, height, options = {}) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  const untouched = { pixels, applied: false, removedRatio: 0, color: null };
  if (!pixels || !(w > 7 && h > 7) || pixels.length < w * h * 4) return untouched;
  const tolerance = clampNumber(options.tolerance, 8, 120, 30);
  const uniformShare = clampNumber(options.uniformShare, 0.5, 1, 0.9);
  const sample = backdropSample(pixels, w, h, tolerance);
  if (sample.clearShare > 0.02 || sample.share < uniformShare) return untouched;

  const total = w * h;
  const isBackdrop = new Uint8Array(total);
  const stack = new Int32Array(total);
  let top = 0;
  const seed = (index) => {
    if (isBackdrop[index]) return;
    if (channelSpread(pixels, index * 4, sample.color) > tolerance) return;
    isBackdrop[index] = 1;
    stack[top++] = index;
  };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 1; y < h - 1; y++) { seed(y * w); seed(y * w + w - 1); }
  let removed = 0;
  while (top > 0) {
    const index = stack[--top];
    removed++;
    const x = index % w;
    const y = (index - x) / w;
    if (x > 0) seed(index - 1);
    if (x < w - 1) seed(index + 1);
    if (y > 0) seed(index - w);
    if (y < h - 1) seed(index + w);
  }
  const removedRatio = removed / total;
  // A backdrop that swallows the whole picture is a blank upload, not a subject to cut around.
  if (removedRatio < 0.02 || removedRatio > 0.97) return untouched;

  const out = new Uint8ClampedArray(pixels);
  for (let index = 0; index < total; index++) if (isBackdrop[index]) out[index * 4 + 3] = 0;
  // Soften the single ring of pixels touching the backdrop so the traced edge does not stair-step.
  for (let index = 0; index < total; index++) {
    if (isBackdrop[index]) continue;
    const x = index % w;
    const y = (index - x) / w;
    const touches = (x > 0 && isBackdrop[index - 1]) || (x < w - 1 && isBackdrop[index + 1])
      || (y > 0 && isBackdrop[index - w]) || (y < h - 1 && isBackdrop[index + w]);
    if (!touches) continue;
    const p = index * 4;
    const spread = channelSpread(pixels, p, sample.color);
    const graded = Math.max(0, Math.min(255, Math.round((255 * (spread - tolerance)) / (tolerance * 1.2))));
    if (graded < out[p + 3]) out[p + 3] = graded;
  }
  return { pixels: out, applied: true, removedRatio, color: sample.color };
}

// ---------------------------------------------------------------- contour tracing

/**
 * Marching-squares boundary tracing over a binary mask.
 * Returns one polygon (array of [x, y] points in mask pixel space) per closed loop,
 * every polygon wound clockwise in screen space so that a positive offsetPath() grows it.
 * Outer boundaries and holes are traced with the same winding, so the two are told
 * apart by containment depth (see contourDepths) rather than by direction.
 */
export function traceContours(mask, width, height) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!(w > 1 && h > 1) || !mask) return [];
  // One transparent pixel of padding, so a shape that runs right up to the edge of the mask
  // still has a boundary to follow there. Without it the outer loop is left open at the edge
  // and the trace breaks into slivers. The frame shifts every coordinate by one, which is
  // undone again as the loops are read out below.
  const pw = w + 2, ph = h + 2;
  const stride = 2 * pw + 1;
  const key = (px, py) => py * stride + px;
  const edges = new Map();
  const link = (ax, ay, bx, by) => {
    const ka = key(ax, ay), kb = key(bx, by);
    let la = edges.get(ka); if (!la) { la = []; edges.set(ka, la); }
    let lb = edges.get(kb); if (!lb) { lb = []; edges.set(kb, lb); }
    la.push(kb); lb.push(ka);
  };
  const on = (x, y) => (x >= 1 && y >= 1 && x <= w && y <= h && mask[(y - 1) * w + (x - 1)]) ? 1 : 0;

  for (let y = 0; y < ph - 1; y++) {
    for (let x = 0; x < pw - 1; x++) {
      const idx = (on(x, y) << 3) | (on(x + 1, y) << 2) | (on(x + 1, y + 1) << 1) | on(x, y + 1);
      if (idx === 0 || idx === 15) continue;
      const tx = 2 * x + 1, ty = 2 * y;       // top edge midpoint
      const rx = 2 * x + 2, ry = 2 * y + 1;   // right edge midpoint
      const bx = 2 * x + 1, by = 2 * y + 2;   // bottom edge midpoint
      const lx = 2 * x, ly = 2 * y + 1;       // left edge midpoint
      switch (idx) {
        case 1: case 14: link(lx, ly, bx, by); break;
        case 2: case 13: link(bx, by, rx, ry); break;
        case 3: case 12: link(lx, ly, rx, ry); break;
        case 4: case 11: link(tx, ty, rx, ry); break;
        case 6: case 9: link(tx, ty, bx, by); break;
        case 7: case 8: link(lx, ly, tx, ty); break;
        case 5: link(lx, ly, tx, ty); link(bx, by, rx, ry); break;
        case 10: link(lx, ly, bx, by); link(tx, ty, rx, ry); break;
      }
    }
  }

  const contours = [];
  const used = new Set();
  for (const [startKey, list] of edges) {
    for (const nextKey of list) {
      const seedId = startKey < nextKey ? `${startKey}:${nextKey}` : `${nextKey}:${startKey}`;
      if (used.has(seedId)) continue;
      const loop = [];
      let cur = startKey, nxt = nextKey, guard = 0;
      while (guard++ < 4000000) {
        const a = Math.min(cur, nxt), b = Math.max(cur, nxt);
        const segId = `${a}:${b}`;
        if (used.has(segId)) break;
        used.add(segId);
        const nx = nxt % stride, ny = (nxt - nx) / stride;
        loop.push([nx / 2 - 1, ny / 2 - 1]);
        const around = edges.get(nxt);
        let follow = -1;
        for (let i = 0; i < around.length; i++) {
          if (around[i] !== cur) { follow = around[i]; break; }
        }
        if (follow === -1) break;
        cur = nxt; nxt = follow;
      }
      if (loop.length >= 3) contours.push(orientClockwise(loop));
    }
  }
  return contours;
}

function orientClockwise(points) {
  let signed = 0;
  for (let i = 0, n = points.length; i < n; i++) {
    const p = points[i], q = points[(i + 1) % n];
    signed += p[0] * q[1] - q[0] * p[1];
  }
  return signed < 0 ? points.slice().reverse() : points;
}

/**
 * Signed area of a closed polygon. Positive means clockwise in screen space (y grows
 * downwards), which is the winding traceContours() normalises every loop to.
 */
export function signedArea(points) {
  let signed = 0;
  for (let i = 0, n = points.length; i < n; i++) {
    const p = points[i], q = points[(i + 1) % n];
    signed += p[0] * q[1] - q[0] * p[1];
  }
  return signed / 2;
}

/** Even-odd ray casting. Points exactly on an edge are undefined but rare in practice. */
export function pointInPolygon(point, polygon) {
  const x = Number(point[0]), y = Number(point[1]);
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = Number(polygon[i][0]), yi = Number(polygon[i][1]);
    const xj = Number(polygon[j][0]), yj = Number(polygon[j][1]);
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Evenly spaced sample vertices used to decide whether one loop sits inside another. */
function samplePoints(points, count = 9) {
  const n = points.length;
  if (n <= count) return points.slice();
  const step = n / count;
  const out = [];
  for (let i = 0; i < count; i++) out.push(points[Math.floor(i * step)]);
  return out;
}

/**
 * Nesting depth per contour: 0 is an outer boundary, 1 is a hole, 2 is an island
 * inside a hole, and so on. Even depth is material, odd depth is a cut-out.
 */
export function contourDepths(contours) {
  const list = Array.isArray(contours) ? contours : [];
  const depths = new Array(list.length).fill(0);
  for (let i = 0; i < list.length; i++) {
    if (!list[i] || list[i].length < 3) continue;
    const samples = samplePoints(list[i], 9);
    for (let j = 0; j < list.length; j++) {
      if (i === j || !list[j] || list[j].length < 3) continue;
      let hits = 0;
      for (const point of samples) if (pointInPolygon(point, list[j])) hits++;
      if (hits * 2 > samples.length) depths[i] += 1;
    }
  }
  return depths;
}

/**
 * Offset every contour of a shape by the same physical distance, in the direction that
 * grows the material: outer boundaries move outwards, holes shrink by the same amount.
 * Passing the plain `+distance` to every loop would seal holes shut.
 */
export function offsetContours(contours, distancePx) {
  const list = Array.isArray(contours) ? contours : [];
  const distance = Number(distancePx);
  if (!Number.isFinite(distance) || distance === 0) return list.map((points) => points);
  const depths = contourDepths(list);
  return list.map((points, index) => {
    if (!points || points.length < 3) return points;
    const outward = depths[index] % 2 === 0 ? distance : -distance;
    return offsetPath(orientClockwise(points), outward);
  });
}
export function polygonArea(points) {
  return Math.abs(signedArea(points));
}

/** Keep meaningful loops, biggest first, so noise never reaches the exporter. */
export function cleanContours(contours, minAreaPx = 24, maxContours = 40) {
  if (!Array.isArray(contours)) return [];
  const kept = contours
    .filter((points) => Array.isArray(points) && points.length >= 3 && polygonArea(points) >= minAreaPx)
    .sort((a, b) => polygonArea(b) - polygonArea(a));
  return kept.slice(0, maxContours);
}

// ---------------------------------------------------------------- path cleanup

/** Douglas-Peucker simplification that also works on a closed polygon. */
export function simplifyPath(points, tolerance) {
  const n = points.length;
  const tol = Number(tolerance);
  if (n < 4 || !(tol > 0)) return points;
  let far = 1, farD = -1;
  const x0 = points[0][0], y0 = points[0][1];
  for (let i = 1; i < n; i++) {
    const dx = points[i][0] - x0, dy = points[i][1] - y0;
    const d = dx * dx + dy * dy;
    if (d > farD) { farD = d; far = i; }
  }
  if (far <= 1 || far >= n - 1) return points;
  const head = douglasPeucker(points.slice(0, far + 1), tol);
  const tail = douglasPeucker(points.slice(far).concat([points[0]]), tol);
  const out = head.slice(0, -1).concat(tail.slice(0, -1));
  return out.length >= 3 ? out : points;
}

function douglasPeucker(points, tolerance) {
  const n = points.length;
  if (n < 3) return points.slice();
  const tol2 = tolerance * tolerance;
  const keep = new Uint8Array(n);
  keep[0] = 1; keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    if (last <= first + 1) continue;
    const ax = points[first][0], ay = points[first][1];
    const dx = points[last][0] - ax, dy = points[last][1] - ay;
    const len2 = dx * dx + dy * dy;
    let maxD = -1, idx = -1;
    for (let i = first + 1; i < last; i++) {
      const px = points[i][0] - ax, py = points[i][1] - ay;
      let d;
      if (len2 === 0) {
        d = px * px + py * py;
      } else {
        const t = Math.max(0, Math.min(1, (px * dx + py * dy) / len2));
        const ex = px - t * dx, ey = py - t * dy;
        d = ex * ex + ey * ey;
      }
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol2 && idx > 0) {
      keep[idx] = 1;
      stack.push([first, idx], [idx, last]);
    }
  }
  const out = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(points[i]);
  return out;
}

/** Closed-polygon smoothing via repeated weighted moving average (no shrinkage artifacts). */
export function smoothPath(points, strength) {
  const iterations = Math.min(8, normalizeCutlineSmoothing(strength));
  let pts = points;
  for (let pass = 0; pass < iterations; pass++) {
    const n = pts.length;
    if (n < 5) break;
    const next = new Array(n);
    for (let i = 0; i < n; i++) {
      const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
      next[i] = [(a[0] + 2 * b[0] + c[0]) / 4, (a[1] + 2 * b[1] + c[1]) / 4];
    }
    pts = next;
  }
  return pts;
}

/**
 * Uniform outward offset of a clockwise polygon using a miter joint.
 * Positive `distancePx` grows the shape; the miter is clamped so spikes cannot explode.
 */
export function offsetPath(points, distancePx) {
  const n = points.length;
  const distance = Number(distancePx);
  if (n < 3 || !Number.isFinite(distance) || distance === 0) return points;
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n], cur = points[i], next = points[(i + 1) % n];
    const inx = cur[0] - prev[0], iny = cur[1] - prev[1];
    const outx = next[0] - cur[0], outy = next[1] - cur[1];
    const l1 = Math.hypot(inx, iny) || 1, l2 = Math.hypot(outx, outy) || 1;
    const n1x = iny / l1, n1y = -inx / l1;
    const n2x = outy / l2, n2y = -outx / l2;
    let mx = n1x + n2x, my = n1y + n2y;
    const ml = Math.hypot(mx, my);
    if (ml < 1e-6) { out[i] = [cur[0] + n2x * distance, cur[1] + n2y * distance]; continue; }
    mx /= ml; my /= ml;
    const cos = mx * n1x + my * n1y;
    const scale = cos > 1 / 6 ? 1 / cos : 6;
    out[i] = [cur[0] + mx * distance * scale, cur[1] + my * distance * scale];
  }
  return out;
}

export function scalePath(points, sx, sy = sx) {
  return points.map(([x, y]) => [x * sx, y * sy]);
}

export function translatePath(points, dx, dy) {
  return points.map(([x, y]) => [x + dx, y + dy]);
}

export function boundsOfContours(contours) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const pts of contours) {
    for (const [x, y] of pts) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

// ---------------------------------------------------------------- ornament geometry

/** Every hanging shape the ornament tool can draw, in the order the UI offers them. */
export const ORNAMENT_SHAPES = Object.freeze(["round", "oval", "hexagon", "star", "heart", "arch"]);

export function isOrnamentShape(shape) {
  return ORNAMENT_SHAPES.includes(shape);
}

/**
 * Closed polygon for a hanging ornament, in a local box of width x height.
 * The shape is scaled so its own bounding box fills the box exactly, which keeps
 * "longest side" meaning the same thing for every silhouette.
 */
export function ornamentShapePoints(shape, width, height, samples = 160) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Ornament width and height must be positive.");
  const count = Math.max(24, Math.floor(Number(samples) || 160));
  const id = isOrnamentShape(shape) ? shape : "round";
  const raw = rawOrnamentPolygon(id, count);
  return fitPolygonToBox(raw, w, h);
}

function rawOrnamentPolygon(shape, samples) {
  const pts = [];
  if (shape === "heart") {
    for (let i = 0; i < samples; i++) {
      const t = (i / samples) * Math.PI * 2;
      const s = Math.sin(t);
      const x = 16 * s * s * s;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      pts.push([x, -y]);
    }
    return pts;
  }
  if (shape === "star") {
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? 1 : 0.44;
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      pts.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
    }
    return pts;
  }
  if (shape === "hexagon") {
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 3;
      pts.push([Math.cos(angle), Math.sin(angle)]);
    }
    return pts;
  }
  if (shape === "arch") {
    // Semicircular top, straight sides, flat bottom: the classic acrylic plaque.
    const half = Math.floor(samples / 2);
    for (let i = 0; i <= half; i++) {
      const angle = Math.PI + (i / half) * Math.PI;
      pts.push([0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle)]);
    }
    pts.push([1, 1], [0, 1]);
    return pts;
  }
  // round and oval share one ellipse; the box decides which one you actually get.
  for (let i = 0; i < samples; i++) {
    const angle = -Math.PI / 2 + (i / samples) * Math.PI * 2;
    pts.push([Math.cos(angle), Math.sin(angle)]);
  }
  return pts;
}

/** Translate and scale a polygon so its own bounding box becomes exactly 0,0 -> w,h. */
export function fitPolygonToBox(points, width, height) {
  const w = Number(width), h = Number(height);
  const box = boundsOfContours([points]);
  if (!box || box.width <= 0 || box.height <= 0) throw new Error("Cannot fit a degenerate polygon to a box.");
  const sx = w / box.width, sy = h / box.height;
  return points.map(([x, y]) => [(x - box.minX) * sx, (y - box.minY) * sy]);
}

/** Smallest y where the outline crosses the vertical line at `x`. */
export function topEdgeAtX(points, x) {
  let best = Infinity;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length];
    if (x1 === x2) {
      if (Math.abs(x1 - x) < 1e-9) best = Math.min(best, y1, y2);
      continue;
    }
    const lo = Math.min(x1, x2), hi = Math.max(x1, x2);
    if (x < lo - 1e-9 || x > hi + 1e-9) continue;
    best = Math.min(best, y1 + ((x - x1) / (x2 - x1)) * (y2 - y1));
  }
  return Number.isFinite(best) ? best : 0;
}

/**
 * Horizontal extent of the outline along the scan line \`y\`. Returns null when the line
 * misses the shape, so callers can probe for a band wide enough to hold a caption.
 */
export function widthAtY(points, y) {
  let minX = Infinity, maxX = -Infinity;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length];
    if (y1 === y2) {
      if (Math.abs(y1 - y) < 1e-9) { minX = Math.min(minX, x1, x2); maxX = Math.max(maxX, x1, x2); }
      continue;
    }
    const lo = Math.min(y1, y2), hi = Math.max(y1, y2);
    if (y < lo - 1e-9 || y > hi + 1e-9) continue;
    const x = x1 + ((y - y1) / (y2 - y1)) * (x2 - x1);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, maxX, width: maxX - minX };
}

export function circleInsidePolygon(cx, cy, r, points, samples = 32) {
  if (!pointInPolygon([cx, cy], points)) return false;
  for (let i = 0; i < samples; i++) {
    const angle = (i / samples) * Math.PI * 2;
    if (!pointInPolygon([cx + r * Math.cos(angle), cy + r * Math.sin(angle)], points)) return false;
  }
  return true;
}

/**
 * Drill hole for the hanging cord. The hole starts just under the top of the outline and
 * slides down, shrinking if it must, until the whole circle sits on solid material.
 * That keeps every silhouette - including the heart's centre notch and the star's narrow
 * point - safe to cut on real acrylic.
 */
export function ornamentHole(shape, width, height) {
  const w = Number(width), h = Number(height);
  const points = ornamentShapePoints(shape, w, h);
  const cx = w / 2;
  const top = topEdgeAtX(points, cx);
  const nominal = Math.max(6, Math.min(w, h) * 0.03);
  for (let r = nominal; r >= 4; r -= nominal / 24) {
    for (let step = 0; step <= 48; step++) {
      const cy = top + r * 1.7 + (step / 48) * r * 3.2;
      if (circleInsidePolygon(cx, cy, r, points)) return { cx, cy, r: Math.round(r * 100) / 100 };
    }
  }
  return { cx, cy: top + nominal * 1.7, r: Math.round(Math.max(3, nominal * 0.4) * 100) / 100 };
}

// ---------------------------------------------------------------- luggage tag geometry

/** Every silhouette the luggage tag tool can draw, in the order the UI offers them. */
export const LUGGAGE_TAG_SHAPES = Object.freeze(["rounded", "tag", "circle", "oval"]);


export function isLuggageTagShape(shape) {
  return LUGGAGE_TAG_SHAPES.includes(shape);
}

/** True when the pet ID tag tool can draw this silhouette. */
export function isPetTagShape(shape) {
  return PET_TAG_SHAPES.includes(shape);
}

/**
 * Pet ID tag outlines. A pet tag is the same slab as a bag tag, so the polygons come from
 * the same builder; only the default silhouette and the sizes the tool offers differ.
 */
export function petTagShapePoints(shape, width, height, samples = 160) {
  return luggageTagShapePoints(isPetTagShape(shape) ? shape : "circle", width, height, samples);
}

/**
 * Closed polygon for a travel tag, in a local box of width x height.
 * Every silhouette is flat-bottomed so the printed name and contact line sit on a straight
 * edge, and every one is fitted to the box so "longest side" means the same thing.
 */
export function luggageTagShapePoints(shape, width, height, samples = 160) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Luggage tag width and height must be positive.");
  const count = Math.max(24, Math.floor(Number(samples) || 160));
  const id = isLuggageTagShape(shape) ? shape : "rounded";
  return fitPolygonToBox(rawLuggageTagPolygon(id, count), w, h);
}

function rawLuggageTagPolygon(shape, samples) {
  if (shape === "tag") {
    // Flat strap point, chamfered shoulders, straight sides: the classic shipping tag.
    const top = 0.56;
    const shoulder = 0.19;
    const left = (1 - top) / 2;
    return [[left, 0], [left + top, 0], [1, shoulder], [1, 1], [0, 1], [0, shoulder]];
  }
  if (shape === "circle" || shape === "oval") {
    const pts = [];
    for (let i = 0; i < samples; i++) {
      const angle = -Math.PI / 2 + (i / samples) * Math.PI * 2;
      pts.push([Math.cos(angle), Math.sin(angle)]);
    }
    return pts;
  }
  // Rounded rectangle: the default shop-bought acrylic tag.
  const r = 0.15;
  const pts = [];
  const steps = Math.max(3, Math.floor(samples / 4) - 1);
  const corners = [
    [1 - r, r, -Math.PI / 2, 0],
    [1 - r, 1 - r, 0, Math.PI / 2],
    [r, 1 - r, Math.PI / 2, Math.PI],
    [r, r, Math.PI, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

/**
 * Drill hole for the bag strap. Same search the ornament hole uses: start near the top of
 * the outline and slide down, shrinking if needed, until the whole circle is on material.
 * A fused strap point therefore keeps its hole safely inside the flat top.
 */
export function luggageTagHole(shape, width, height) {
  const w = Number(width), h = Number(height);
  const points = luggageTagShapePoints(shape, w, h);
  const cx = w / 2;
  const top = topEdgeAtX(points, cx);
  const nominal = Math.max(6, Math.min(w, h) * 0.055);
  for (let r = nominal; r >= 4; r -= nominal / 24) {
    for (let step = 0; step <= 48; step++) {
      const cy = top + r * 1.55 + (step / 48) * r * 3.4;
      if (circleInsidePolygon(cx, cy, r, points)) return { cx, cy, r: Math.round(r * 100) / 100 };
    }
  }
  return { cx, cy: top + nominal * 1.55, r: Math.round(Math.max(3, nominal * 0.4) * 100) / 100 };
}

// ---------------------------------------------------------------- cake topper geometry

export function isCakeTopperStyle(style) {
  return CAKE_TOPPER_STYLES.includes(style);
}

/**
 * The welding bar that keeps a two-word topper in one piece. It is measured from the type
 * itself rather than from a fixed fraction of the box, because it has to overlap the lowest
 * ink: a word with descenders such as "Happy Birthday" needs a taller band than an all-caps
 * word, and a bar that missed the letters would ship as loose acrylic.
 *
 * @param {number} width    canvas width the bar spans
 * @param {number} baseline y of the text baseline in the same coordinate space
 * @param {number} ascent   distance from the baseline up to the tallest ink
 * @param {number} descent  distance from the baseline down to the lowest ink
 */
export function cakeTopperBarRect(width, baseline, ascent, descent) {
  const safeW = Math.max(1, Number(width));
  const cap = Math.max(1, Number(ascent));
  const drop = Math.max(0, Number(descent));
  const top = Number(baseline) - cap * 0.16;
  const bottom = Number(baseline) + Math.max(drop, cap * 0.06) + cap * 0.08;
  return { x: 0, y: top, w: safeW, h: bottom - top };
}

/** The circle a plaque-style topper is cut from, inset so the text always has a margin. */
export function cakeTopperPlaque(width, height) {
  const safeW = Math.max(1, Number(width));
  const safeH = Math.max(1, Number(height));
  const size = Math.min(safeW, safeH);
  return { cx: safeW / 2, cy: safeH / 2, r: size * 0.5 };
}

// ---------------------------------------------------------------- bookmark geometry

export function isBookmarkShape(shape) {
  return BOOKMARK_SHAPES.includes(shape);
}

/**
 * Closed polygon for an acrylic bookmark, in a local box of width x height.
 * Every silhouette is a tall slab rather than a square, because a bookmark that is not
 * tall stops reading as a bookmark, and every one is fitted to the box so "longest side"
 * means the same thing whatever the shape and whatever the photo behind it.
 */
export function bookmarkShapePoints(shape, width, height, samples = 160) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Bookmark width and height must be positive.");
  const count = Math.max(24, Math.floor(Number(samples) || 160));
  const id = isBookmarkShape(shape) ? shape : "classic";
  return fitPolygonToBox(rawBookmarkPolygon(id, count), w, h);
}

function rawBookmarkPolygon(shape, samples) {
  if (shape === "arch") {
    // Rounded top, straight sides, flat bottom: the reading-app bookmark silhouette.
    const half = Math.floor(samples / 2);
    const pts = [];
    for (let i = 0; i <= half; i++) {
      const angle = Math.PI + (i / half) * Math.PI;
      pts.push([0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle)]);
    }
    pts.push([1, 1], [0, 1]);
    return pts;
  }
  if (shape === "notch") {
    // Straight slab with a V cut out of the bottom edge, like a ribbon bookmark.
    return [[0, 0], [1, 0], [1, 1], [0.64, 1], [0.5, 0.84], [0.36, 1], [0, 1]];
  }
  if (shape === "pointed") {
    // Straight slab that tapers to a single point, so it slips between two pages.
    return [[0, 0], [1, 0], [1, 0.8], [0.5, 1], [0, 0.8]];
  }
  // Classic: a plain rounded slab, the shape of a shop-bought acrylic blank.
  const r = 0.09;
  const pts = [];
  const steps = Math.max(3, Math.floor(samples / 4) - 1);
  const corners = [
    [1 - r, r, -Math.PI / 2, 0],
    [1 - r, 1 - r, 0, Math.PI / 2],
    [r, 1 - r, Math.PI / 2, Math.PI],
    [r, r, Math.PI, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

/**
 * Drill hole for the tassel. Same search the tag and ornament holes use: start just under
 * the top of the outline and slide down, shrinking if it must, until the whole circle sits
 * on solid material, so a narrow bookmark slab still keeps a clean hole.
 */
export function bookmarkHole(shape, width, height) {
  const w = Number(width), h = Number(height);
  const points = bookmarkShapePoints(shape, w, h);
  const cx = w / 2;
  const top = topEdgeAtX(points, cx);
  const nominal = Math.max(5, Math.min(w, h) * 0.05);
  for (let r = nominal; r >= 3.5; r -= nominal / 24) {
    for (let step = 0; step <= 48; step++) {
      const cy = top + r * 1.7 + (step / 48) * r * 3.4;
      if (circleInsidePolygon(cx, cy, r, points)) return { cx, cy, r: Math.round(r * 100) / 100 };
    }
  }
  return { cx, cy: top + nominal * 1.7, r: Math.round(Math.max(2.5, nominal * 0.4) * 100) / 100 };
}

// ---------------------------------------------------------------- coaster geometry

export function isCoasterShape(shape) {
  return COASTER_SHAPES.includes(shape);
}

/**
 * Closed polygon for an acrylic coaster inside a square box. A coaster is sold as a square
 * blank or a round one, so the footprint is always 1:1 and the uploaded photo is
 * cover-fitted into it instead of setting the silhouette.
 */
export function coasterShapePoints(shape, width, height, samples = 160) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Coaster width and height must be positive.");
  const count = Math.max(24, Math.floor(Number(samples) || 160));
  const id = isCoasterShape(shape) ? shape : "square";
  return fitPolygonToBox(rawCoasterPolygon(id, count), w, h);
}

function rawCoasterPolygon(shape, samples) {
  if (shape === "round") {
    const pts = [];
    for (let i = 0; i < samples; i++) {
      const a = (i / samples) * Math.PI * 2;
      pts.push([0.5 + 0.5 * Math.cos(a), 0.5 + 0.5 * Math.sin(a)]);
    }
    return pts;
  }
  // Square: a rounded square blank, the shape a laser-cut coaster ships in.
  const r = 0.07;
  const pts = [];
  const steps = Math.max(3, Math.floor(samples / 4) - 1);
  const corners = [
    [1 - r, r, -Math.PI / 2, 0],
    [1 - r, 1 - r, 0, Math.PI / 2],
    [r, 1 - r, Math.PI / 2, Math.PI],
    [r, r, Math.PI, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

// ---------------------------------------------------------------- desk name plate geometry

export function isNamePlateFinish(finish) {
  return NAME_PLATE_FINISHES.includes(finish);
}

/**
 * Closed polygon for a desk name plate. The product is a long, low acrylic slab, so the
 * footprint is fixed at the selected inch size and the corner radius is measured from the
 * short side, which keeps the corners soft on a 2 x 12 plate as well as a 2 x 8 one.
 */
export function deskNamePlatePoints(width, height, samples = 96) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Desk name plate width and height must be positive.");
  const steps = Math.max(3, Math.floor(Math.max(24, Number(samples) || 96) / 4) - 1);
  const r = Math.min(w, h) * 0.14;
  const pts = [];
  const corners = [
    [w - r, r, -Math.PI / 2, 0],
    [w - r, h - r, 0, Math.PI / 2],
    [r, h - r, Math.PI / 2, Math.PI],
    [r, r, Math.PI, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

// ---------------------------------------------------------------- jigsaw geometry

/** The grid behind a difficulty choice, with the first grid as the fallback. */
export function jigsawGrid(value) {
  return JIGSAW_GRIDS.find((grid) => grid.id === value) || JIGSAW_GRIDS[0];
}

export function isJigsawGrid(value) {
  return JIGSAW_GRIDS.some((grid) => grid.id === value);
}

/**
 * The classic jigsaw knob drawn in a unit frame: x runs 0 -> 1 along the edge and y is how
 * far the tab bulges out, also as a fraction of the edge length. The neck is narrower than
 * the head, so two neighbouring pieces lock together instead of sliding apart, and the head
 * tops out near 0.29 of the edge, which is the depth a die-cut puzzle knob really has.
 * Every row is one cubic Bezier segment: [start, control, control, end].
 */
const JIGSAW_TAB = Object.freeze([
  [[0, 0], [0.34, 0], [0.34, 0], [0.34, 0]],
  [[0.34, 0], [0.44, 0], [0.28, 0.05], [0.35, 0.13]],
  [[0.35, 0.13], [0.28, 0.37], [0.72, 0.37], [0.65, 0.13]],
  [[0.65, 0.13], [0.72, 0.05], [0.56, 0], [0.66, 0]],
  [[0.66, 0], [0.82, 0], [0.92, 0], [1, 0]],
]);

/** One point on a cubic Bezier segment, the shape every jigsaw knob is built from. */
function cubicPoint(segment, t) {
  const [p0, c1, c2, p3] = segment;
  const mt = 1 - t;
  const a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t;
  return [
    a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0],
    a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1],
  ];
}

/**
 * One jigsaw cut between two lattice points. "bulge" picks which side of the edge the knob
 * grows into, so the caller can hand the same edge to both neighbours and still get a tab
 * on one piece and the matching notch on the other.
 */
export function jigsawEdgePoints(x0, y0, x1, y1, bulge, samples = 20) {
  const ox = Number(x0), oy = Number(y0), tx = Number(x1), ty = Number(y1);
  const dx = tx - ox, dy = ty - oy;
  const length = Math.hypot(dx, dy);
  if (!(length > 0)) throw new Error("A jigsaw edge needs two distinct points.");
  const ux = dx / length, uy = dy / length;
  const side = Number(bulge) < 0 ? -1 : 1;
  const px = -uy * side, py = ux * side;
  const count = Math.max(4, Math.floor(Number(samples) || 20));
  const points = [];
  for (const segment of JIGSAW_TAB) {
    for (let i = 0; i < count; i++) {
      const [u, v] = cubicPoint(segment, i / count);
      points.push([ox + ux * length * u + px * length * v, oy + uy * length * u + py * length * v]);
    }
  }
  points.push([tx, ty]);
  return points;
}

/** Deterministic +/-1 per grid slot: a mixed hash so the knobs scatter instead of striping. */
function jigsawBulge(a, b, seed) {
  let n = Math.imul(a, 2654435761) ^ Math.imul(b, 40503) ^ Math.imul(seed, 69069);
  n = Math.imul(n ^ (n >>> 15), 2246822519);
  n ^= n >>> 13;
  return (n & 1) ? 1 : -1;
}

/**
 * The cut file for a puzzle: one closed rectangle round the outside plus one open path per
 * interior edge. Each interior edge is drawn once and shared by the two pieces either side
 * of it, which is what makes the tabs interlock, and the pattern comes from the grid slot
 * rather than from a random number so the preview and the download always agree.
 */
export function jigsawCutPaths(width, height, cols, rows, options = {}) {
  const w = Number(width), h = Number(height);
  const c = Math.floor(Number(cols)), r = Math.floor(Number(rows));
  if (!(w > 0 && h > 0)) throw new Error("Jigsaw width and height must be positive.");
  if (!(c > 1 && r > 1)) throw new Error("A jigsaw needs at least a two by two grid.");
  const samples = Math.max(6, Math.floor(Number(options.samples) || 20));
  const seed = Number.isFinite(Number(options.seed)) ? Math.floor(Number(options.seed)) : 1;
  const outline = [[0, 0], [w, 0], [w, h], [0, h]];
  const cuts = [];
  for (let col = 1; col < c; col++) {
    for (let row = 0; row < r; row++) {
      const x = (w * col) / c;
      cuts.push(jigsawEdgePoints(x, (h * row) / r, x, (h * (row + 1)) / r, jigsawBulge(col, row, seed), samples));
    }
  }
  for (let row = 1; row < r; row++) {
    for (let col = 0; col < c; col++) {
      const y = (h * row) / r;
      cuts.push(jigsawEdgePoints((w * col) / c, y, (w * (col + 1)) / c, y, jigsawBulge(row + 31, col, seed), samples));
    }
  }
  return { outline, cuts };
}

// ---------------------------------------------------------------- SVG output

/** Straight-segment path data for one or many contours (used for exact cut geometry). */
export function contoursToPathD(contours, precision = 2) {
  const parts = [];
  for (const pts of contours || []) {
    if (!pts || pts.length < 3) continue;
    parts.push(contourToPathD(pts, precision));
  }
  return parts.join("");
}

/** Open path data for a polyline: no closing Z, so an interior cut does not loop back. */
export function polylineToPathD(points, precision = 2) {
  if (!points || points.length < 2) return "";
  const f = (value) => String(Number(value.toFixed(precision)));
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 1; i < points.length; i++) d += `L${f(points[i][0])} ${f(points[i][1])}`;
  return d;
}

export function contourToPathD(points, precision = 2) {
  const f = (value) => String(Number(value.toFixed(precision)));
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 1; i < points.length; i++) d += `L${f(points[i][0])} ${f(points[i][1])}`;
  return `${d}Z`;
}

/** Quadratic-Bezier path data for a visually smooth contour (used for the SVG outline layer). */
export function contourToSmoothD(points, precision = 2) {
  const n = points.length;
  if (n < 3) return "";
  const f = (value) => String(Number(value.toFixed(precision)));
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(points[n - 1], points[0]);
  let d = `M${f(start[0])} ${f(start[1])}`;
  for (let i = 0; i < n; i++) {
    const cur = points[i];
    const m = mid(cur, points[(i + 1) % n]);
    d += `Q${f(cur[0])} ${f(cur[1])} ${f(m[0])} ${f(m[1])}`;
  }
  return `${d}Z`;
}

export function contoursToSmoothD(contours, precision = 2) {
  return (contours || []).map((pts) => contourToSmoothD(pts, precision)).join("");
}

function round(value) {
  return Math.round(value * 100) / 100;
}
// ---------------------------------------------------------------- coloring pages

/**
 * The paper a coloring page is printed on. Both sheets are stored portrait and swapped by the
 * orientation control, so the page geometry has one source of truth.
 */
export const COLORING_PAPERS = Object.freeze([
  { id: "letter", short: "US Letter", label: "US Letter (8.5 x 11 in)", widthCm: 21.59, heightCm: 27.94 },
  { id: "a4", short: "A4", label: "A4 (21 x 29.7 cm)", widthCm: 21, heightCm: 29.7 },
]);

/** The printer border the line art stays inside, in centimetres. */
export const COLORING_MARGIN_CM = 1.27;

/**
 * How the line art is drawn. "outline" posterizes the photo and inks the seam between
 * neighboring tones, which closes shapes the way a coloring book does. "sketch" runs an
 * extended difference of Gaussians, which keeps the pencil-drawing look.
 */
export const COLORING_STYLES = Object.freeze([
  { id: "outline", label: "Clean outlines" },
  { id: "sketch", label: "Pencil sketch" },
]);

/**
 * How much of the photo survives into the drawing. "blur" is a fraction of the art's long side
 * rather than a pixel count, so the preview and the 300 DPI print agree on what the setting
 * means, and "ink" is the share of the sheet that is allowed to come back as line.
 */
export const COLORING_DETAILS = Object.freeze([
  { id: "simple", label: "Simple", levels: 3, blur: 0.01, ink: 0.1 },
  { id: "balanced", label: "Balanced", levels: 4, blur: 0.006, ink: 0.14 },
  { id: "detailed", label: "Detailed", levels: 5, blur: 0.0035, ink: 0.2 },
]);

/** Printed line weights, in millimetres, resolved to whole pixels at the export DPI. */
export const COLORING_WEIGHTS = Object.freeze([
  { id: "fine", label: "Fine", mm: 0.5 },
  { id: "medium", label: "Medium", mm: 0.9 },
  { id: "bold", label: "Bold", mm: 1.4 },
]);

function coloringLookup(list, value, aliases) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  if (aliases && Object.prototype.hasOwnProperty.call(aliases, raw)) return list[aliases[raw]];
  for (let i = 0; i < list.length; i++) if (list[i].id === raw) return list[i];
  return null;
}

/** Paper lookup: an unknown sheet falls back to US Letter, the size most visitors print on. */
export function coloringPaper(value) {
  return coloringLookup(COLORING_PAPERS, value, { "us-letter": 0, "8.5x11": 0, "8.5 x 11": 0 }) || COLORING_PAPERS[0];
}

/** Style lookup: anything unrecognized is the outline style, which is the better coloring page. */
export function coloringStyle(value) {
  const found = coloringLookup(COLORING_STYLES, value, { pencil: 1, "pencil-sketch": 1, line: 0, lines: 0 });
  return found || COLORING_STYLES[0];
}

export function coloringDetail(value) {
  return coloringLookup(COLORING_DETAILS, value, { low: 0, easy: 0, medium: 1, high: 2, more: 2 }) || COLORING_DETAILS[1];
}

export function coloringWeight(value) {
  return coloringLookup(COLORING_WEIGHTS, value, { thin: 0, normal: 1, thick: 2, heavy: 2, extra: 2 }) || COLORING_WEIGHTS[1];
}

/** Millimetres of printed line -> whole pixels at a DPI, never less than one so a line shows. */
export function lineWeightPx(millimetres, dpi = PRINT_DPI) {
  const mm = Number(millimetres), safeDpi = Number(dpi);
  if (!(mm > 0) || !(safeDpi > 0)) return 1;
  return Math.max(1, Math.round((mm / 25.4) * safeDpi));
}

/** Half of the printed line weight in whole pixels: the dilation that thickens a traced hairline. */
export function lineRadiusPx(millimetres, dpi = PRINT_DPI) {
  return Math.max(0, Math.round((lineWeightPx(millimetres, dpi) - 1) / 2));
}

function cmToPixels(cm, dpi) {
  return Math.max(1, Math.round((Number(cm) / 2.54) * dpi));
}

/**
 * Page geometry for one coloring sheet: the paper, the printer margin and the pixel box the
 * line art is drawn into at the export DPI. The preview and the download both read this, so a
 * change to the margin can never make the screen and the printer disagree.
 */
export function coloringPage(paperValue, orientation, dpi = PRINT_DPI) {
  const paper = coloringPaper(paperValue);
  const safeDpi = Number(dpi) > 0 ? Number(dpi) : PRINT_DPI;
  const landscape = String(orientation === undefined || orientation === null ? "" : orientation).trim().toLowerCase() === "landscape";
  const widthCm = landscape ? paper.heightCm : paper.widthCm;
  const heightCm = landscape ? paper.widthCm : paper.heightCm;
  const artWidthCm = Math.max(1, widthCm - COLORING_MARGIN_CM * 2);
  const artHeightCm = Math.max(1, heightCm - COLORING_MARGIN_CM * 2);
  const widthPx = cmToPixels(widthCm, safeDpi);
  const heightPx = cmToPixels(heightCm, safeDpi);
  const artWidthPx = cmToPixels(artWidthCm, safeDpi);
  const artHeightPx = cmToPixels(artHeightCm, safeDpi);
  return {
    id: paper.id,
    short: paper.short,
    label: paper.label,
    orientation: landscape ? "landscape" : "portrait",
    dpi: safeDpi,
    widthCm: round(widthCm),
    heightCm: round(heightCm),
    marginCm: COLORING_MARGIN_CM,
    artWidthCm: round(artWidthCm),
    artHeightCm: round(artHeightCm),
    widthPx,
    heightPx,
    artWidthPx,
    artHeightPx,
    marginPx: Math.max(0, Math.round((widthPx - artWidthPx) / 2)),
  };
}

/**
 * Contain-fit a source box inside a destination box and center it on whole pixels. The result
 * carries the scale as well as the pixel box, because the line weight and the blur are both
 * expressed in the destination's pixels.
 */
export function fitBox(sourceWidth, sourceHeight, boxWidth, boxHeight) {
  const sw = Number(sourceWidth), sh = Number(sourceHeight);
  const bw = Number(boxWidth), bh = Number(boxHeight);
  if (!(sw > 0) || !(sh > 0) || !(bw > 0) || !(bh > 0)) {
    throw new Error("fitBox needs positive source and destination sizes.");
  }
  const scale = Math.min(bw / sw, bh / sh);
  const width = Math.max(1, Math.round(sw * scale));
  const height = Math.max(1, Math.round(sh * scale));
  return {
    width: width,
    height: height,
    scale: scale,
    x: Math.round((bw - width) / 2),
    y: Math.round((bh - height) / 2),
  };
}

/**
 * RGBA pixels -> one 0-255 luminance byte per pixel, with any transparency laid over white.
 * Flattening here keeps every later pass branch-free, and it means a cut-out PNG traces the
 * subject rather than the transparent box it arrived in.
 */
export function grayscalePlane(pixels, width, height) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!(w > 0 && h > 0)) throw new Error("Plane dimensions must be positive.");
  if (!pixels || pixels.length < w * h * 4) throw new Error("Pixel buffer is smaller than the plane dimensions.");
  const out = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < out.length; i++, p += 4) {
    const alpha = pixels[p + 3] / 255;
    const paper = 255 * (1 - alpha);
    const r = pixels[p] * alpha + paper;
    const g = pixels[p + 1] * alpha + paper;
    const b = pixels[p + 2] * alpha + paper;
    out[i] = Math.max(0, Math.min(255, Math.round(0.299 * r + 0.587 * g + 0.114 * b)));
  }
  return out;
}

/**
 * Separable box blur on an 8-bit plane, with the edges clamped so the border does not darken.
 * Two of these per axis stand in for a Gaussian, which is all a threshold needs to see.
 */
export function boxBlurPlane(plane, width, height, radius) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!(w > 0 && h > 0)) throw new Error("Plane dimensions must be positive.");
  if (!plane || plane.length < w * h) throw new Error("Plane buffer is smaller than the plane dimensions.");
  const r = Math.max(0, Math.floor(Number(radius) || 0));
  if (r === 0) return Uint8Array.from(plane.subarray(0, w * h));
  const span = 2 * r + 1;
  const pass = new Uint8Array(w * h);
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let sum = 0;
    for (let k = -r; k <= r; k++) sum += plane[row + Math.min(w - 1, Math.max(0, k))];
    for (let x = 0; x < w; x++) {
      pass[row + x] = Math.round(sum / span);
      sum += plane[row + Math.min(w - 1, x + r + 1)] - plane[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let k = -r; k <= r; k++) sum += pass[Math.min(h - 1, Math.max(0, k)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = Math.round(sum / span);
      sum += pass[Math.min(h - 1, y + r + 1) * w + x] - pass[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}

/** The tone boundaries that split an 8-bit plane into equally common bands. */
export function posterizeThresholds(plane, levels) {
  const bands = Math.max(2, Math.min(16, Math.floor(Number(levels) || 2)));
  const histogram = new Uint32Array(256);
  for (let i = 0; i < plane.length; i++) histogram[plane[i]]++;
  const thresholds = [];
  const total = plane.length;
  let seen = 0, bin = 0;
  for (let step = 1; step < bands; step++) {
    const target = (total * step) / bands;
    while (bin < 255 && seen + histogram[bin] < target) { seen += histogram[bin]; bin++; }
    thresholds.push(Math.max(1, Math.min(255, bin)));
  }
  return thresholds;
}

/** Flatten a photo into a few tone bands, which is what turns it into colorable regions. */
export function posterizePlane(plane, width, height, levels) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!plane || plane.length < w * h) throw new Error("Plane buffer is smaller than the plane dimensions.");
  const thresholds = posterizeThresholds(plane.subarray(0, w * h), levels);
  const out = new Uint8Array(w * h);
  for (let i = 0; i < out.length; i++) {
    const value = plane[i];
    let label = 0;
    while (label < thresholds.length && value >= thresholds[label]) label++;
    out[i] = label;
  }
  return out;
}

/**
 * The seam between neighboring tone bands, which is what gives the outline style its closed,
 * coloring-book shapes. The outer frame is left out so the printer margin stays blank.
 */
export function boundaryMask(labels, width, height) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!labels || labels.length < w * h) throw new Error("Label buffer is smaller than the plane dimensions.");
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const value = labels[i];
      if ((x > 0 && labels[i - 1] !== value) || (x < w - 1 && labels[i + 1] !== value)) { out[i] = 1; continue; }
      if ((y > 0 && labels[i - w] !== value) || (y < h - 1 && labels[i + w] !== value)) out[i] = 1;
    }
  }
  return out;
}

/**
 * Extended difference of Gaussians response for the sketch style: the photo minus a blurrier,
 * slightly faded copy of itself. Flat areas land near zero and only the tonal edges survive,
 * which is what makes the result read as pencil rather than as a photograph.
 */
export function differenceOfGaussians(plane, width, height, sigma = 1.5, fade = 0.985) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!(w > 0 && h > 0)) throw new Error("Plane dimensions must be positive.");
  if (!plane || plane.length < w * h) throw new Error("Plane buffer is smaller than the plane dimensions.");
  const sharp = Math.max(1, Math.round(Number(sigma) || 1.5));
  const soft = Math.max(sharp + 1, Math.round(sharp * 1.6));
  const a = boxBlurPlane(boxBlurPlane(plane, w, h, sharp), w, h, sharp);
  const b = boxBlurPlane(boxBlurPlane(plane, w, h, soft), w, h, soft);
  const p = Math.max(0.5, Math.min(1, Number(fade) || 0.985));
  const out = new Float32Array(w * h);
  for (let i = 0; i < out.length; i++) out[i] = a[i] - p * b[i];
  return out;
}

/**
 * The value below which `quantile` of a response plane sits, read off a coarse histogram so a
 * full 300 DPI sheet can be thresholded without ever being sorted.
 */
export function quantileThreshold(values, quantile) {
  const n = values.length;
  if (!n) return 0;
  const q = Math.max(0, Math.min(1, Number(quantile) || 0));
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < n; i++) {
    const v = values[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!(max > min)) return max;
  const bins = 1024;
  const histogram = new Uint32Array(bins);
  const scale = (bins - 1) / (max - min);
  for (let i = 0; i < n; i++) histogram[Math.round((values[i] - min) * scale)]++;
  const target = n * q;
  let seen = 0;
  for (let b = 0; b < bins; b++) {
    seen += histogram[b];
    if (seen >= target) return min + b / scale;
  }
  return max;
}

/** Binary mask of every value at or above `threshold`. */
export function maskAbove(values, width, height, threshold) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!values || values.length < w * h) throw new Error("Value buffer is smaller than the plane dimensions.");
  const limit = Number(threshold);
  const out = new Uint8Array(w * h);
  for (let i = 0; i < out.length; i++) out[i] = values[i] >= limit ? 1 : 0;
  return out;
}

/**
 * Grow every line by `radius` pixels, so the printed line weight is a real measurement instead
 * of whatever the posterize pass happened to produce. Separable, so the cost stays linear in
 * the pixel count no matter how heavy the line.
 */
export function dilateMask(mask, width, height, radius) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!(w > 0 && h > 0)) throw new Error("Mask dimensions must be positive.");
  if (!mask || mask.length < w * h) throw new Error("Mask buffer is smaller than the mask dimensions.");
  const r = Math.max(0, Math.floor(Number(radius) || 0));
  if (r === 0) return Uint8Array.from(mask.subarray(0, w * h));
  const horizontal = new Uint8Array(w * h);
  const out = new Uint8Array(w * h);
  const queue = new Int32Array(w + 1);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let head = 0, tail = 0;
    for (let x = 0; x < w + r; x++) {
      if (x < w) {
        const value = mask[row + x];
        while (tail > head && mask[row + queue[tail - 1]] <= value) tail--;
        queue[tail++] = x;
      }
      const target = x - r;
      if (target < 0) continue;
      while (queue[head] < target - r) head++;
      horizontal[row + target] = mask[row + queue[head]];
    }
  }
  const column = new Int32Array(h + 1);
  for (let x = 0; x < w; x++) {
    let head = 0, tail = 0;
    for (let y = 0; y < h + r; y++) {
      if (y < h) {
        const value = horizontal[y * w + x];
        while (tail > head && horizontal[column[tail - 1] * w + x] <= value) tail--;
        column[tail++] = y;
      }
      const target = y - r;
      if (target < 0) continue;
      while (column[head] < target - r) head++;
      out[target * w + x] = horizontal[column[head] * w + x];
    }
  }
  return out;
}

/**
 * A threshold leaves one-pixel specks behind on a busy photo. A pixel only survives as ink when
 * it is part of a stroke rather than a stray dot, and a matching pass fills pinholes so the
 * lines print solid instead of dotted.
 */
export function despeckleMask(mask, width, height, minNeighbours = 2) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!mask || mask.length < w * h) throw new Error("Mask buffer is smaller than the mask dimensions.");
  const floor = Math.max(1, Math.min(4, Math.floor(Number(minNeighbours) || 2)));
  const out = Uint8Array.from(mask.subarray(0, w * h));
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      let neighbours = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx !== 0 || dy !== 0) neighbours += mask[i + dy * w + dx];
        }
      }
      if (mask[i]) { if (neighbours < floor) out[i] = 0; }
      else if (neighbours >= 9 - floor) out[i] = 1;
    }
  }
  return out;
}

/** Swap ink for paper, for the white-on-black tracing sheet. */
export function invertMask(mask) {
  const out = new Uint8Array(mask.length);
  for (let i = 0; i < out.length; i++) out[i] = mask[i] ? 0 : 1;
  return out;
}

/** Share of the sheet that ends up as ink, which the readout quotes back to the visitor. */
export function maskInkRatio(mask) {
  if (!mask || !mask.length) return 0;
  let ink = 0;
  for (let i = 0; i < mask.length; i++) ink += mask[i] ? 1 : 0;
  return ink / mask.length;
}

/**
 * A printable word search puzzle. These helpers are deliberately small and pure: the browser
 * app and the Node test suite both build the same grid from the same seed, so what a visitor
 * sees on screen is exactly what the 300 DPI download contains.
 */
export function wordSearchPaper(value) {
  const raw = String(value == null ? "" : value).toLowerCase();
  const cm = Number(value);
  return WORD_SEARCH_PAPERS.find((paper) => paper.id === raw
    || (Number.isFinite(cm) && cm > 0 && Math.abs(paper.widthCm - cm) < 0.02)) || WORD_SEARCH_PAPERS[0];
}

export function wordSearchGrid(value) {
  const id = String(value == null ? "" : value);
  return WORD_SEARCH_GRIDS.find((grid) => grid.id === id) || WORD_SEARCH_GRIDS[0];
}

export function wordSearchLevel(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return WORD_SEARCH_LEVELS.find((level) => level.id === id) || WORD_SEARCH_LEVELS[0];
}

export function wordSearchTheme(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return WORD_SEARCH_THEMES.find((theme) => theme.id === id) || null;
}

export function wordSearchCase(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return WORD_SEARCH_CASES.find((item) => item.id === id) || WORD_SEARCH_CASES[0];
}

/** Print a whole word in the case the sheet was set in. */
export function wordSearchWord(text, caseValue) {
  const c = wordSearchCase(caseValue);
  const word = String(text == null ? "" : text);
  return c.id === "lower" ? word.toLowerCase() : word.toUpperCase();
}

/**
 * Turn whatever the visitor pasted into a clean list: one word per line, a comma separated run,
 * or a mix of the two. Anything that is not a letter is dropped, duplicates folded away, and
 * the list trimmed to what a grid can actually hold.
 */
export function wordSearchList(value, limit = WORD_SEARCH_LIMIT) {
  const raw = String(value == null ? "" : value);
  const seen = new Set();
  const out = [];
  const cap = Math.max(1, Math.min(WORD_SEARCH_LIMIT, Math.floor(Number(limit)) || WORD_SEARCH_LIMIT));
  for (const chunk of raw.split(/[\n,;]+/)) {
    const word = chunk.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, WORD_SEARCH_WORD_MAX);
    if (word.length < 2 || seen.has(word)) continue;
    seen.add(word);
    out.push(word);
    if (out.length >= cap) break;
  }
  return out;
}

/**
 * How many cells a list needs: the longest word plus a little breathing room, then enough area
 * that the words can cross each other instead of filling the grid edge to edge.
 */
export function wordSearchAutoCells(words) {
  const list = Array.isArray(words) ? words : [];
  const longest = list.reduce((max, word) => Math.max(max, String(word).length), 0);
  const byWord = longest + 1;
  const byCount = Math.ceil(Math.sqrt(list.length * 8)) + 3;
  return Math.max(10, Math.min(20, Math.max(byWord, byCount)));
}

/**
 * A small repeatable generator. Every tool that shuffles something - a word grid, a bingo card, a
 * number draw - shares this one stream, so a seed always rebuilds the same artwork and a printed
 * sheet can be reproduced later from the same settings.
 */
export function seededRandom(seed) {
  let a = (Number(seed) >>> 0) || 0x9e3779b9;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The word search keeps its own name for the shared stream, so every pinned seed builds the grid it always did. */
function wordSearchRandom(seed) {
  return seededRandom(seed);
}

/**
 * Lay the words into a square grid. Longer words go down first because a long word has the
 * fewest places it can sit, then each word is tried at random spots and locked in as soon as
 * it fits over whatever is already there. Every letter it crosses has to match.
 */
export function wordSearchBuild(words, options) {
  const opts = options || {};
  const list = (Array.isArray(words) ? words : [])
    .map((word) => String(word).toUpperCase().replace(/[^A-Z]/g, "").slice(0, WORD_SEARCH_WORD_MAX))
    .filter((word) => word.length >= 2)
    .slice(0, WORD_SEARCH_LIMIT);
  const cells = Math.max(6, Math.min(24, Math.floor(Number(opts.cells)) || wordSearchAutoCells(list)));
  const level = wordSearchLevel(opts.level);
  const random = wordSearchRandom(opts.seed == null ? 1 : opts.seed);
  const grid = Array.from({ length: cells }, () => new Array(cells).fill(""));
  const placements = [];
  const dropped = [];
  const ordered = list.slice().sort((a, b) => b.length - a.length);
  ordered.forEach((word) => {
    const letters = word.split("");
    let found = null;
    for (let attempt = 0; attempt < 1600 && !found; attempt++) {
      const dir = level.dirs[Math.floor(random() * level.dirs.length)];
      if (!dir) continue;
      const dx = dir[0];
      const dy = dir[1];
      const colSpan = (letters.length - 1) * Math.abs(dx);
      const rowSpan = (letters.length - 1) * Math.abs(dy);
      if (colSpan >= cells || rowSpan >= cells) break;
      const colBase = Math.floor(random() * (cells - colSpan));
      const rowBase = Math.floor(random() * (cells - rowSpan));
      const col0 = dx < 0 ? colBase + colSpan : colBase;
      const row0 = dy < 0 ? rowBase + rowSpan : rowBase;
      let ok = true;
      for (let i = 0; i < letters.length && ok; i++) {
        const r = row0 + dy * i;
        const c = col0 + dx * i;
        if (r < 0 || c < 0 || r >= cells || c >= cells) { ok = false; break; }
        const existing = grid[r][c];
        if (existing && existing !== letters[i]) ok = false;
      }
      if (ok) found = { word, row: row0, col: col0, dx, dy, length: letters.length };
    }
    if (!found) { dropped.push(word); return; }
    placements.push(found);
    for (let i = 0; i < letters.length; i++) {
      grid[found.row + found.dy * i][found.col + found.dx * i] = letters[i];
    }
  });
  // Fill every blank square with a random letter, so the puzzle cannot be read off the gaps.
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const filled = grid.map((row) => row.map((cell) => cell || alphabet[Math.floor(random() * 26)]));
  return Object.freeze({
    cells,
    grid: Object.freeze(filled.map((row) => Object.freeze(row))),
    placements: Object.freeze(placements.map((item) => Object.freeze(item))),
    placed: placements.length,
    dropped: Object.freeze(dropped),
    level,
  });
}

/** The grid squares a word covers, keyed the way the answer overlay looks them up. */
export function wordSearchPath(placement) {
  const item = placement || {};
  const out = [];
  const length = Math.max(0, Math.floor(Number(item.length)) || 0);
  for (let i = 0; i < length; i++) {
    out.push([(Number(item.row) || 0) + (Number(item.dy) || 0) * i, (Number(item.col) || 0) + (Number(item.dx) || 0) * i]);
  }
  return out;
}

/**
 * The puzzle page: paper, a title band, the biggest square grid the margins allow and the word
 * list underneath. Reading the cell size from one place keeps the preview and the print in step.
 */
export function wordSearchSheet(options) {
  const opts = options || {};
  const paper = wordSearchPaper(opts.paper);
  const cells = Math.max(6, Math.min(24, Math.floor(Number(opts.cells)) || 10));
  const marginCm = WORD_SEARCH_MARGIN_CM;
  const titleCm = opts.title === false ? 0 : WORD_SEARCH_TITLE_CM;
  const listCm = opts.list === false ? 0 : WORD_SEARCH_LIST_CM;
  const usableW = Math.max(4, paper.widthCm - marginCm * 2);
  const usableH = Math.max(4, paper.heightCm - marginCm * 2 - titleCm - listCm);
  const gridCm = Math.max(4, Math.min(usableW, usableH));
  return Object.freeze({
    paper,
    cells,
    marginCm,
    titleCm,
    listCm,
    usableW,
    usableH,
    gridCm,
    cellCm: gridCm / cells,
    gridX: (paper.widthCm - gridCm) / 2,
    gridY: marginCm + titleCm,
  });
}

/** Number of word list columns the sheet uses, so a long list stays inside the paper. */
export function wordSearchListColumns(words, max = WORD_SEARCH_LIST_COLUMNS) {
  const count = (Array.isArray(words) ? words : []).length;
  const columns = Math.max(1, Math.floor(Number(max)) || WORD_SEARCH_LIST_COLUMNS);
  if (count <= 8) return 1;
  if (count <= 16) return Math.min(2, columns);
  return columns;
}

/**
 * A printable bingo game. These helpers are pure and deterministic: the browser app and the Node
 * test suite build the same cards from the same seed, so what a visitor previews is exactly what
 * the 300 DPI download contains.
 */
export function bingoPaper(value) {
  const raw = String(value == null ? "" : value).toLowerCase();
  const cm = Number(value);
  return BINGO_PAPERS.find((paper) => paper.id === raw
    || (Number.isFinite(cm) && cm > 0 && Math.abs(paper.widthCm - cm) < 0.02)) || BINGO_PAPERS[0];
}

export function bingoGrid(value) {
  const id = String(value == null ? "" : value);
  return BINGO_GRIDS.find((grid) => grid.id === id) || BINGO_GRIDS[0];
}

export function bingoLayout(value) {
  const id = String(value == null ? "" : value);
  return BINGO_LAYOUTS.find((layout) => layout.id === id) || BINGO_LAYOUTS[0];
}

export function bingoMode(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return BINGO_MODES.find((mode) => mode.id === id) || BINGO_MODES[0];
}

export function bingoTheme(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return BINGO_THEMES.find((theme) => theme.id === id) || null;
}

export function bingoCase(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return BINGO_CASES.find((item) => item.id === id) || BINGO_CASES[0];
}

/** Print one entry in the case the card was set in. Numbers are left exactly as they were drawn. */
export function bingoEntry(text, caseValue) {
  const raw = String(text == null ? "" : text);
  if (raw === "FREE" || /^[0-9]+$/.test(raw)) return raw;
  return bingoCase(caseValue).id === "lower" ? raw.toLowerCase() : raw.toUpperCase();
}

/** One to thirty unique cards, which is what a class set needs and what one sheet can hold. */
export function bingoCardCount(value) {
  const count = Math.floor(Number(value));
  if (!Number.isFinite(count) || count < 1) return 1;
  return Math.min(BINGO_MAX_CARDS, count);
}

/**
 * Clean a pasted list into bingo entries: one per line or a comma separated run, punctuation
 * dropped, duplicates folded away and the list trimmed to what a card can hold.
 */
export function bingoWords(value, limit = BINGO_WORD_LIMIT) {
  const raw = String(value == null ? "" : value);
  const seen = new Set();
  const out = [];
  const cap = Math.max(1, Math.min(BINGO_WORD_LIMIT, Math.floor(Number(limit)) || BINGO_WORD_LIMIT));
  for (const chunk of raw.split(/[\n,;]+/)) {
    const word = chunk.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, BINGO_WORD_MAX);
    if (!word || seen.has(word)) continue;
    seen.add(word);
    out.push(word);
    if (out.length >= cap) break;
  }
  return out;
}

/** How many entries a card of this size needs once the free square is taken out. */
export function bingoNeeded(cells, free) {
  const size = Math.max(3, Math.min(5, Math.floor(Number(cells)) || 5));
  return size * size - (free && size % 2 === 1 ? 1 : 0);
}

/** The free square sits in the middle of an odd card, which is why an even card never carries one. */
export function bingoFreeCell(cells, free) {
  const size = Math.max(3, Math.min(5, Math.floor(Number(cells)) || 5));
  if (!free || size % 2 === 0) return null;
  const mid = (size - 1) / 2;
  return Object.freeze({ row: mid, col: mid });
}

/**
 * A classic number board. The five column card draws every column from its own fifteen numbers
 * the way a printed B/I/N/G/O card does, so the B column only ever holds 1 to 15 and the O column
 * only ever holds 61 to 75. The smaller squares spread the same 1 to 75 range instead.
 */
export function bingoNumberGrid(cells, seed, free) {
  const size = Math.max(3, Math.min(5, Math.floor(Number(cells)) || 5));
  const random = seededRandom(seed);
  const grid = Array.from({ length: size }, () => new Array(size).fill(""));
  if (size === BINGO_COLUMNS.length) {
    for (let col = 0; col < size; col += 1) {
      const pool = [];
      for (let i = 0; i < 15; i += 1) pool.push(col * 15 + i + 1);
      for (let i = pool.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        const swap = pool[i]; pool[i] = pool[j]; pool[j] = swap;
      }
      // Sorting the five drawn numbers makes the column read upwards like a real card.
      const drawn = pool.slice(0, size).sort((a, b) => a - b);
      for (let row = 0; row < size; row += 1) grid[row][col] = String(drawn[row]);
    }
  } else {
    const pool = [];
    for (let i = 1; i <= BINGO_NUMBER_CEILING; i += 1) pool.push(i);
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      const swap = pool[i]; pool[i] = pool[j]; pool[j] = swap;
    }
    pool.slice(0, size * size).sort((a, b) => a - b).forEach((number, index) => {
      grid[Math.floor(index / size)][index % size] = String(number);
    });
  }
  const freeCell = bingoFreeCell(size, free);
  if (freeCell) grid[freeCell.row][freeCell.col] = "FREE";
  return grid;
}

/**
 * A word board. The list is shuffled with the card's own seed and laid out row by row, so two
 * cards in the same set never hide the words in the same places. A list that is too short leaves
 * the last squares empty, and the readout tells the visitor how many more entries the card needs.
 */
export function bingoWordGrid(words, cells, seed, free) {
  const size = Math.max(3, Math.min(5, Math.floor(Number(cells)) || 5));
  const pool = (Array.isArray(words) ? words : []).map((word) => String(word));
  const random = seededRandom(seed);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const swap = pool[i]; pool[i] = pool[j]; pool[j] = swap;
  }
  const freeCell = bingoFreeCell(size, free);
  const grid = Array.from({ length: size }, () => new Array(size).fill(""));
  let index = 0;
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (freeCell && freeCell.row === row && freeCell.col === col) {
        grid[row][col] = "FREE";
        continue;
      }
      grid[row][col] = index < pool.length ? pool[index] : "";
      index += 1;
    }
  }
  return grid;
}

/**
 * The whole set. Every card draws its own seed, so no two cards in a print run hide the entries
 * in the same order, and a card that comes out identical to one already built is rebuilt rather
 * than handed to a second player.
 */
export function bingoCardSet(options) {
  const opts = options || {};
  const grid = bingoGrid(opts.cells);
  const mode = bingoMode(opts.mode);
  const count = bingoCardCount(opts.count);
  const free = !!opts.free;
  const words = mode.id === "words" ? (Array.isArray(opts.words) ? opts.words : []) : [];
  const base = (Number(opts.seed) >>> 0) || 1;
  const out = [];
  const seen = new Set();
  for (let index = 0; index < count; index += 1) {
    let attempt = 0;
    let card = null;
    let signature = "";
    do {
      const seed = base + index * 7919 + attempt * 104729;
      card = mode.id === "numbers"
        ? bingoNumberGrid(grid.cells, seed, free)
        : bingoWordGrid(words, grid.cells, seed, free);
      signature = card.map((row) => row.join("|")).join("/");
      attempt += 1;
    } while (seen.has(signature) && attempt < 64);
    seen.add(signature);
    out.push(Object.freeze(card.map((row) => Object.freeze(row))));
  }
  return Object.freeze(out);
}

/**
 * Where every card sits on the printed sheet. The cards keep the tall printed proportion, are
 * capped so a single card never bleeds off the page, and are centred inside their own slot so the
 * preview and the 300 DPI download place every card identically.
 */
export function bingoSheet(options) {
  const opts = options || {};
  const paper = bingoPaper(opts.paper);
  const layout = bingoLayout(opts.layout);
  const marginCm = BINGO_MARGIN_CM;
  const gapCm = BINGO_GAP_CM;
  const usableW = Math.max(4, paper.widthCm - marginCm * 2);
  const usableH = Math.max(4, paper.heightCm - marginCm * 2);
  const slotW = (usableW - gapCm * (layout.cols - 1)) / layout.cols;
  const slotH = (usableH - gapCm * (layout.rows - 1)) / layout.rows;
  const cardW = Math.min(BINGO_CARD_MAX_CM, slotW, slotH * BINGO_CARD_ASPECT);
  const cardH = cardW / BINGO_CARD_ASPECT;
  const cards = [];
  for (let row = 0; row < layout.rows; row += 1) {
    for (let col = 0; col < layout.cols; col += 1) {
      cards.push(Object.freeze({
        x: marginCm + col * (slotW + gapCm) + (slotW - cardW) / 2,
        y: marginCm + row * (slotH + gapCm) + (slotH - cardH) / 2,
        w: cardW,
        h: cardH,
      }));
    }
  }
  return Object.freeze({
    paper,
    layout,
    marginCm,
    gapCm,
    usableW,
    usableH,
    slotW,
    slotH,
    cardW,
    cardH,
    // The three bands inside one card: a title strip, a square grid and a small credit line.
    headerCm: cardH * 0.14,
    footerCm: cardH * 0.075,
    gridCm: cardW * 0.9,
    cards: Object.freeze(cards),
  });
}

/** Sheets in the print run: one per group of cards, plus the caller's page when it is switched on. */
export function bingoPageCount(options) {
  const opts = options || {};
  const layout = bingoLayout(opts.layout);
  const perSheet = layout.cols * layout.rows;
  return Math.ceil(bingoCardCount(opts.count) / perSheet) + (opts.callList ? 1 : 0);
}

/**
 * The caller's list. A number game draws all seventy five in the order they should be called, so
 * the caller works down one page instead of improvising. A word game simply hands back the list.
 */
export function bingoCallList(options) {
  const opts = options || {};
  const mode = bingoMode(opts.mode);
  if (mode.id !== "numbers") return Object.freeze((Array.isArray(opts.words) ? opts.words : []).slice());
  const random = seededRandom((Number(opts.seed) >>> 0) || 1);
  const pool = [];
  for (let i = 1; i <= BINGO_NUMBER_CEILING; i += 1) pool.push(i);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const swap = pool[i]; pool[i] = pool[j]; pool[j] = swap;
  }
  return Object.freeze(pool);
}

/** How many columns the caller's list folds into, so seventy five numbers still fit one page. */
export function bingoCallColumns(total, max = 6) {
  const count = Math.max(0, Math.floor(Number(total)) || 0);
  const columns = Math.max(1, Math.floor(Number(max)) || 6);
  if (count <= 30) return Math.min(3, columns);
  if (count <= 48) return Math.min(4, columns);
  return columns;
}

/**
 * A chore chart is a week across and a short list of jobs down, so one piece of geometry lays the
 * whole sheet out: a title band, a weekday header, even rows and a reward line. Keeping it here
 * means the preview and the printed page agree to the millimetre.
 */
export function chartPaper(value) {
  const raw = String(value == null ? "" : value).toLowerCase();
  const cm = Number(value);
  return CHART_PAPERS.find((paper) => paper.id === raw
    || (Number.isFinite(cm) && cm > 0 && Math.abs(paper.widthCm - cm) < 0.02)) || CHART_PAPERS[0];
}

export function chartDays(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return CHART_DAYS.find((days) => days.id === id) || CHART_DAYS[0];
}

export function chartStyle(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return CHART_STYLES.find((style) => style.id === id) || CHART_STYLES[0];
}

export function chartTheme(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return CHART_THEMES.find((theme) => theme.id === id) || CHART_THEMES[0];
}

/** Rows are clamped rather than rejected, so a stray value in the number box still prints a chart. */
export function chartRows(value) {
  const rows = Math.floor(Number(value));
  if (!Number.isFinite(rows) || rows <= 0) return 8;
  return Math.max(CHART_MIN_ROWS, Math.min(CHART_MAX_ROWS, rows));
}

/** One chore a line, with commas and semicolons accepted as separators for pasted lists. */
export function chartChores(value, limit = CHART_ROW_LIMIT) {
  const cap = Math.max(1, Math.min(CHART_ROW_LIMIT, Math.floor(Number(limit)) || CHART_ROW_LIMIT));
  const text = String(value == null ? "" : value);
  const out = [];
  for (const chunk of text.split(/[\n,;]+/)) {
    const tidy = chunk.replace(/\s+/g, " ").trim().slice(0, CHART_CHORE_MAX);
    if (tidy && !out.includes(tidy)) out.push(tidy);
    if (out.length >= cap) break;
  }
  return Object.freeze(out);
}

/** A printed line is a single row of pixels, so it is flattened to one line and clipped. */
export function chartText(value, max = CHART_TITLE_MAX) {
  const cap = Math.max(1, Math.floor(Number(max)) || CHART_TITLE_MAX);
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, cap);
}

export function chartSheet(options) {
  const opts = options || {};
  const paper = chartPaper(opts.paper);
  const days = chartDays(opts.days);
  const rows = chartRows(opts.rows);
  const marginCm = CHART_MARGIN_CM;
  const usableW = paper.widthCm - marginCm * 2;
  const usableH = paper.heightCm - marginCm * 2;
  const titleCm = usableH * 0.115;
  const headCm = usableH * 0.055;
  const rewardCm = usableH * 0.06;
  const gapCm = usableH * 0.014;
  const bodyCm = usableH - titleCm - headCm - rewardCm - gapCm;
  const rowCm = bodyCm / rows;
  const labelW = usableW * 0.36;
  const cols = days.names.length;
  const colW = (usableW - labelW) / cols;
  return {
    paper, days, rows, marginCm, gapCm, usableW, usableH,
    titleCm, headCm, rewardCm, bodyCm, rowCm, labelW, colW, cols,
  };
}

export function mulType(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return MUL_TYPES.find((type) => type.id === id) || MUL_TYPES[0];
}

export function mulRange(value) {
  const raw = String(value == null ? "" : value).trim();
  const max = Number(raw);
  return MUL_RANGES.find((range) => range.id === raw
    || (Number.isFinite(max) && max > 0 && range.max === max)) || MUL_RANGES[1];
}

export function mulFill(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return MUL_FILLS.find((fill) => fill.id === id) || MUL_FILLS[0];
}

export function mulSquares(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return MUL_SQUARES.find((mode) => mode.id === id) || MUL_SQUARES[0];
}

export function mulOrient(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return MUL_ORIENTS.find((orient) => orient.id === id) || MUL_ORIENTS[0];
}

/** True when the printed answer key should show this product at this row and column. */
export function mulShowsAnswer(fill, row, col, max) {
  const mode = mulFill(fill).id;
  if (mode === "blank") return false;
  if (mode === "partial") return col >= row;
  return true;
}

/**
 * One sheet recipe drives the preview and the print. The grid is n + 1 cells square, because the
 * factors need a header row and a header column; the written-out times tables fall into blocks
 * that are sized to the same paper. Every measurement is in centimetres so print matches screen.
 */
export function mulSheet(options) {
  const opts = options || {};
  const paper = chartPaper(opts.paper);
  const orient = mulOrient(opts.orient);
  const type = mulType(opts.type);
  const range = mulRange(opts.max);
  const marginCm = MUL_MARGIN_CM;
  const widthCm = orient.id === "landscape" ? paper.heightCm : paper.widthCm;
  const heightCm = orient.id === "landscape" ? paper.widthCm : paper.heightCm;
  const usableW = widthCm - marginCm * 2;
  const usableH = heightCm - marginCm * 2;
  const titleCm = usableH * 0.105;
  const gapCm = usableH * 0.016;
  const bodyCm = usableH - titleCm - gapCm;
  const max = type.id === "tables" ? Math.min(range.max, MUL_TABLES_MAX) : range.max;
  const cols = max + 1;
  const rows = max + 1;
  const cellW = usableW / cols;
  const cellH = bodyCm / rows;
  const cellCm = Math.min(cellW, cellH);
  const aspect = usableW / bodyCm;
  const blockCols = Math.max(1, Math.min(max, Math.round(Math.sqrt(max * aspect * 1.6))));
  const blockRows = Math.ceil(max / blockCols);
  const blockW = usableW / blockCols;
  const blockH = bodyCm / blockRows;
  const lineCm = blockH / (max + 1);
  return {
    paper, orient, type, range, max, marginCm, gapCm,
    widthCm, heightCm, usableW, usableH, titleCm, bodyCm,
    cols, rows, cellW, cellH, cellCm,
    blockCols, blockRows, blockW, blockH, lineCm,
  };
}

export function crownStyle(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return CROWN_STYLES.find((style) => style.id === id) || CROWN_STYLES[0];
}

export function crownBand(value) {
  const id = String(value == null ? "" : value).toLowerCase();
  return CROWN_BANDS.find((band) => band.id === id) || CROWN_BANDS[1];
}

/**
 * One sheet recipe drives the preview and the print. A crown band runs along the long edge of the
 * page, so the sheet is always landscape and the paper is turned; two bands are stacked down the
 * page and each one ends in a tab that tucks behind its neighbour. Every measurement is in
 * centimetres so the printed band measures what the preview promised.
 */
export function crownSheet(options) {
  const opts = options || {};
  const paper = chartPaper(opts.paper);
  const style = crownStyle(opts.style);
  const band = crownBand(opts.band);
  const marginCm = CROWN_MARGIN_CM;
  // The band is printed across the long edge, so the paper is turned to landscape.
  const widthCm = paper.heightCm;
  const heightCm = paper.widthCm;
  const usableW = widthCm - marginCm * 2;
  const usableH = heightCm - marginCm * 2;
  // Tall points are trimmed rather than allowed to run off the page, so a wide band still prints.
  const maxBandH = (usableH - CROWN_MIN_GAP_CM * (CROWN_PER_SHEET + 1)) / CROWN_PER_SHEET;
  const wantedH = band.bodyCm + band.teethCm;
  const shrink = Math.min(1, maxBandH / wantedH);
  const bodyCm = band.bodyCm * shrink;
  const teethCm = band.teethCm * shrink;
  const bandHCm = bodyCm + teethCm;
  const gapCm = (usableH - bandHCm * CROWN_PER_SHEET) / (CROWN_PER_SHEET + 1);
  const topCm = gapCm;
  const tabCm = CROWN_TAB_CM;
  const bodyWCm = usableW - tabCm;
  // Whole points only, so the outline cuts out cleanly and the points stay even.
  const teeth = Math.max(4, Math.round(bodyWCm / CROWN_TOOTH_CM));
  const toothWCm = bodyWCm / teeth;
  return {
    paper, style, band, marginCm, tabCm, perSheet: CROWN_PER_SHEET,
    widthCm, heightCm, usableW, usableH,
    bodyCm, teethCm, bandHCm, gapCm, topCm,
    bodyWCm, teeth, toothWCm,
    // Two bands overlap by one tab, so this is the crown that comes off one sheet.
    fitCm: CROWN_PER_SHEET * usableW - tabCm,
  };
}
