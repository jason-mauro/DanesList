export const sampleListings = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Sample Item ${i + 1}`,
  price: Math.floor(Math.random() * 200),
  imageUrl: `https://picsum.photos/seed/item${i + 1}/300/200`,
}));
