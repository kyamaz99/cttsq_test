export function translatedRoute(routes: string): Array<string> {
  const _t = routes.split("/");
  const [first, ...tail] = _t;
  return [...["/"], ...tail];
}
