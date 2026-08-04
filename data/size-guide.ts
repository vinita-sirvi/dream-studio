/**
 * Size and measurement reference.
 *
 * Powers the /saved-measurements (Size Guide) page and the size-guide drawer on
 * product pages. All values are in inches, which is what our tailors work in.
 */

export type SizeRow = {
  size: string;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
};

export const sizeChart: SizeRow[] = [
  { size: "XS", bust: "31", waist: "25", hip: "34", shoulder: "13.0" },
  { size: "S", bust: "33", waist: "27", hip: "36", shoulder: "13.5" },
  { size: "M", bust: "35", waist: "29", hip: "38", shoulder: "14.0" },
  { size: "L", bust: "37", waist: "31", hip: "40", shoulder: "14.5" },
  { size: "XL", bust: "39", waist: "33", hip: "42", shoulder: "15.0" },
  { size: "2XL", bust: "41", waist: "35", hip: "44", shoulder: "15.5" },
  { size: "3XL", bust: "43", waist: "37", hip: "46", shoulder: "16.0" },
];

export const garmentLengths = [
  { garment: "Short kurti", length: "32–34 in" },
  { garment: "Straight kurti", length: "38–40 in" },
  { garment: "Long kurti / kurta", length: "44–46 in" },
  { garment: "Blouse (regular)", length: "14–15 in" },
  { garment: "Blouse (long)", length: "17–18 in" },
  { garment: "Lehenga skirt", length: "40–42 in" },
  { garment: "Midi dress", length: "44–46 in" },
  { garment: "Maxi dress", length: "54–56 in" },
];

export type MeasurementHowTo = {
  name: string;
  where: string;
  tip: string;
};

/** The twelve measurements, in the order a tailor takes them. */
export const howToMeasure: MeasurementHowTo[] = [
  {
    name: "Bust",
    where: "Around the fullest part of the chest, tape level all the way round.",
    tip: "Keep your arms down and breathe normally — do not hold your breath in.",
  },
  {
    name: "Underbust",
    where: "Directly beneath the bust, where a bra band would sit.",
    tip: "The single most useful measurement for a blouse, and the one most often skipped.",
  },
  {
    name: "Waist",
    where: "At the natural crease when you bend sideways — not at your trouser line.",
    tip: "Usually an inch or two above the navel. Higher than most people expect.",
  },
  {
    name: "Hip",
    where: "Around the widest point, roughly 8 inches below the waist.",
    tip: "Stand with your feet together, or you will read wide.",
  },
  {
    name: "Shoulder width",
    where: "Across the back, from the tip of one shoulder bone to the other.",
    tip: "Far easier with help. Ask someone rather than guessing.",
  },
  {
    name: "Shoulder slope",
    where: "The angle from the neck point down to the shoulder tip.",
    tip: "Why one shoulder can sit lower than the other. We check both sides separately.",
  },
  {
    name: "Front neck depth",
    where: "From the base of the throat down to where you want the neckline to end.",
    tip: "Mark it with a finger and measure to that point — do not estimate.",
  },
  {
    name: "Back neck depth",
    where: "From the prominent bone at the nape down to the desired back opening.",
    tip: "Decide this while looking in a mirror, wearing the right undergarment.",
  },
  {
    name: "Armhole",
    where: "Right round the shoulder joint, through the armpit.",
    tip: "Add half an inch of ease if you want to be able to raise your arms fully.",
  },
  {
    name: "Sleeve length",
    where: "From the shoulder tip down the outside of the slightly bent arm.",
    tip: "Bend the elbow a little, or the finished sleeve will ride up when you move.",
  },
  {
    name: "Bicep",
    where: "Around the fullest part of the upper arm, arm relaxed.",
    tip: "Do not flex. A flexed measurement produces a sleeve that will not close.",
  },
  {
    name: "Garment length",
    where: "From the shoulder tip straight down to where the hem should finish.",
    tip: "Measure against a garment whose length you already like.",
  },
];

export const fitNotes = [
  "All chart values are body measurements, not finished garment measurements. We add ease appropriate to the cut.",
  "If you fall between two sizes, order the larger and tell us at checkout — we will take it in at no charge.",
  "Handloom cotton may shrink up to 3% on first wash. We pre-shrink all cotton before cutting, so buy your true size.",
  "For made-to-measure and bespoke orders the chart is irrelevant: we work from your twelve measurements directly.",
];
