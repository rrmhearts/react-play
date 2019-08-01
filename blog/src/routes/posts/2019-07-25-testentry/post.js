export default {
  title: `Test Entry Title`,
  tags: ['test', 'theology', 'berp'],
  spoiler: "Learn how to add new posts - like a test post.",
  getContent: () => import('./document.mdx'),
}