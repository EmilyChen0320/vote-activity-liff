export const createActivityRoutes = (component) => [
  {
    path: '/:pathMatch(.*)*',
    name: 'home',
    component,
  },
]
