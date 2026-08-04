/**
 * Customer testimonials.
 *
 * Static sample content. A `Testimonial` model already exists in lib/models.ts,
 * so this can be swapped for a database read without changing the components
 * that consume it — the shape here matches that schema.
 */
export type Testimonial = {
  name: string;
  role: string;
  rating: number;
  quote: string;
  location: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ananya Raghavan",
    role: "Bridal commission",
    rating: 5,
    location: "Chennai",
    quote:
      "I sent a photograph of my grandmother's wedding blouse and asked whether it could be remade. They took it apart, drafted a new pattern from it, and returned both — the original restored, and a new one that fits me exactly. I cried at the fitting.",
  },
  {
    name: "Meera Kulkarni",
    role: "Made-to-measure",
    rating: 5,
    location: "Pune",
    quote:
      "I have one shoulder noticeably lower than the other, which every off-the-rack kurti has quietly ignored for thirty years. This is the first garment I have owned that hangs straight. The difference is not subtle.",
  },
  {
    name: "Fatima Sheikh",
    role: "Occasion wear",
    rating: 5,
    location: "Hyderabad",
    quote:
      "The fabric box was the part I did not expect. Eleven swatches arrived, I sat with them for a week, and changed my mind twice. Nobody rushed me. The chanderi I finally chose was the right call.",
  },
  {
    name: "Divya Nambiar",
    role: "Bespoke commission",
    rating: 4.5,
    location: "Bengaluru",
    quote:
      "Delivery ran four days past the estimate because they were not happy with the lining. They told me before I had to ask, which I appreciated more than an on-time parcel I would have had to send back.",
  },
  {
    name: "Ritu Bansal",
    role: "Alterations",
    rating: 5,
    location: "Delhi",
    quote:
      "Brought in three pieces from other labels that had never quite fit. All three came back wearable. They also told me one of them was not worth altering, which is the sort of honesty that earns the next order.",
  },
];
