## Installation

To start the project locally you need to install the dev depencies for the project to have all it needs.

```
npm install
npm run start
```

Please ensure that Tailwind CSS is installed as a depency in the package.json file.

## Starting Tailwind

Before starting the tailwind process, I'll explain a bit how it works under the hood.

- Tailwind uses the tailwind classes that are used in the project to generate a css file called output.css.
- The input.css file actually import the Tailwind module.

To start the Tailwind watching and compiling process, run the CLI tool to scan your template files for classes and build your CSS.

---

```
npx tailwindcss -i ./css/input.css -o ./css/output.css --watch
```

Both script should run at the same time (npm run start and the Tailwind watcher)

## Tailwind config

There is a file in the root of the project called tailwind.config.js.

This is where Tailwind is looking for js and html file to check for styling classes. The current config is tailored for this project so there is no need to change it.

Just below there is a parameter called theme. If you ever want to add specific colors or font to the project, this is where you can do it. Then if you want to use it you just need to add the theme variable to the tailwind css class

Here's an example with the "main" color

```
<div class="bg-main">
```

I don't put the custom font here since it's an adobe font and there is a cdn link on the head of the website.

## Javascript targeting

I've put a bunch of data-attributes to html element and module so they can be target by js script and I hope will help manage the content and interation of each module

### Modules

Each dynamic module should be contained in a `<section>` tag.

They can be target as a whole like this

`document.querySelectorAll('[data-module]')`

or they can be targetted specifically like this:

`document.querySelector('[data-module="badges"]')`

of course you should have no problem targetting them with templating variable.

`document.querySelector('[data-module={var_name}]')`

### Targeting a module view/edit content

Each of these module has a view and an edit layout identified like this

`data-module-view` and `data-module-edit`.

You can target it through the parent section like this

```
const badge_elem = document.querySelector('[data-module="badges"]');
const badge_view = badge_elem.querySelector('[data-module-view]');
```

That way it will only target the view layout of that particular module.
