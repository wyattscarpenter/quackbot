import wiki from "wikijs";

export interface WikipediaSummary {
  title: string;
  url: string;
  summary: string;
  mainImage: string;
}

export async function getWikiSummary(
  search_term: string
): Promise<WikipediaSummary> {
  return (await wiki()
    .find(search_term)
    .then(async (p) => {
      return {
        title: p.raw.title,
        url: p.url(),
        summary: await p.summary(),
        mainImage: await p.mainImage(),
      };
    })) as WikipediaSummary;
}

async function main() {
  const c = await getWikiSummary("botswana");
  console.log(c);
}
