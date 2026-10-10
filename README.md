# xxx's home page

A static, three-page academic homepage for GitHub Pages. No build step or package installation is required. A small browser script reads `papers.yml` using the included YAML parser.

## Edit the website

- **Name:** replace `xxx's home page` in all three HTML files, including their `<title>` elements.
- **About Me:** edit the paragraphs in `index.html`.
- **Research:** edit `research.html`.
- **Miscellaneous:** edit `miscellaneous.html`.
- **Banners:** replace the three `assets/*-banner.jpg` images. Their placement is set in `assets/site.css`.

## Add a paper — edit only papers.yml

1. Open `papers.yml`.
2. Copy an existing entry starting with `  - id:`, or copy the entry from `paper-template.yml`, and paste it under `papers:`. Put newest papers first.
3. Change the title, authors, venue, year, links, and description. Give the entry a unique `id`.
4. Put a thumbnail in `assets/` and set `image` to its filename, for example `assets/my-paper.png`. Add descriptive `image_alt` text.
5. Save and refresh the Research page. There is no rebuild command.

Keep the indentation: two spaces before `- id`, four before fields such as `title`, and six before nested author names or links. Use spaces, not tabs. Quote titles containing a colon, for example `title: 'My Method: A Study'`. You can use double quotes if a title contains an apostrophe.

A minimal entry looks like this:

```yaml
  - id: my-paper
    title: 'My Paper Title'
    authors: [Wenxuan Zhu, Coauthor One]
    venue: Conference name
    year: 2026
    image: assets/my-paper.png
    image_alt: Overview of the method
    highlighted: false
    links:
      paper: https://example.com/paper
      code: https://example.com/code
    description: >-
      A short description of the contribution.
```

`own_name` at the top of the file controls whose name is bolded. `highlighted: true` adds Jon Barron's yellow highlight. Papers display in the order you list them. `author_links` is optional; copy its format from the LDA-1B example if you want linked coauthors. Images, descriptions, and links are optional. Unused fields can be removed. With no papers, use `papers: []`.

Do not edit `research.html` to add papers. It contains the shared page layout; `assets/papers.js` generates the publication rows from the YAML data. Invalid YAML or missing required fields produce a visible message pointing you to `papers.yml`.

The generated rows retain Jon Barron's table structure, `.one` image container, `.papertitle` styling, author emphasis, venue line, slash-separated links, and short description. His stylesheet remains unchanged in `assets/jon-barron.css`. The old `paper-entry-template.html` is retained only as a markup reference, not the editing workflow.

The first real example is LDA-1B, imported from https://lgswdn.github.io/home/ with its author order, coauthor links, teaser, and arXiv venue label as listed there. Its description is a short paraphrase of the paper abstract. The site title intentionally remains `xxx's home page`.

## Publish with GitHub Pages

1. Create a GitHub repository. For a main personal website, name it `YOUR_USERNAME.github.io`. Any other repository name also works as a project website.
2. Upload **the contents of this directory** to the repository root, including `.nojekyll` and the `assets` directory.
3. Open repository **Settings → Pages**.
4. Choose **Deploy from a branch**, select your branch (usually `main`) and **/ (root)**, then save.
5. GitHub provides the published URL. Future commits to the selected branch update the website.

All internal URLs are relative, so the site works both at the domain root and under a repository subpath.

## Preview locally

Run `python3 -m http.server 8000` from this directory and visit `http://localhost:8000`. Use this HTTP preview rather than double-clicking HTML files: browsers block loading the YAML and modules through `file://` URLs.

## Sources

See `CREDITS.md` for code and image provenance. No personal biography or publications were copied from either design reference.

GitHub documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Edit course projects

Edit the `<article class="course-project">` block in `miscellaneous.html`. Each entry has a title, course/semester/instructor line, English abstract, and Code / Report links. Copy the block to add another project. Keep report language labels, such as `Report (Chinese)`, explicit.
