import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch, setHeaders }) => {
  console.log(params);

  const res = await fetch(`https://api.skolorna.com/v0/oden/menus/${params.id}`);
  const data = await res.json();

  console.log(data);

  setHeaders({
    age: res.headers.get("age"),
    "cache-control": res.headers.get("cache-control"),
  });

  return {
    title: data.title,
    data: `<pre>${JSON.stringify(data, null, 2)}</pre>`
  }
}
