# nextjs-jump-starter

A NextJS](https://nextjs.org/) project template, with fully functional [Chakra-UI](https://chakra-ui.com/) navigation, [Jest](https://jestjs.io/) testing, [i18next](https://www.i18next.com/) internationalization, and [Google Analytics](https://github.com/react-ga/react-ga).

(Built with [Typescript](https://www.typescriptlang.org/).)

## Base Configuration

This template is designed to quickly bootstrap a new next.js project using [NextJS](https://nextjs.org/), [Typescript](https://www.typescriptlang.org/), [Chakra-UI](https://chakra-ui.com/), [Jest](https://jestjs.io/), [i18next](https://www.i18next.com/) and [Google Analytics](https://github.com/react-ga/react-ga).

It's not a one size fits all solution, but if it's right for you, it will get you up to speed quickly.

Specifically, the following libraries are used:

- chakra-ui
- formik
- jest
- next
- next-i18next
- jest
- react-cookie-consent
- react-ga
- typescript

You'll generate a skeleton application with working Analytics and Navigation, with Page and API placeholders.

([SWC](https://swc.rs/) is used by NextJS to run the dev environment, and [Babel](https://babeljs.io/) is used by Jest during testing.)

## Components

### [Analytics](./src/components/analytics)

This folder contains components that can be used to enclose clickable elements you wish to generate analytics events from. These elements are used to create higher order components that generate analytics events.

This project uses the [react-ga](https://www.npmjs.com/package/react-ga) library for analytics, but can easily be swapped out for another solution (all analytics code is centralized in [this hook](./src/hooks/analytics.ts), allowing you to keep the hook's interface and swap out the implementation.)

### [Background](./src/components/background)

This component paints the main screen background colour, and supports Chakra UI's [color mode](https://chakra-ui.com/docs/features/color-mode).

### [Billboard](./src/components/billboard)

This component is used heavily by the other components in this project setup. It's a simple centered dialogue box used to house forms, warnings, dialogues, confirmations or any other significant UI piece aside from the Nav Bar.

### [Button](./src/components/button)

This folder contains a base styled button (supporting [color mode](https://chakra-ui.com/docs/features/color-mode)). There are also analytics included button definitions that extend the base button.

### [Clickable](./src/components/clickable)

This folder contains components that can be wrapped around elements to create external/internal links. Analytics features are built in, and ready to go.

### [Condition](./src/components/condition)

Rather then using ternary statements, most components in this template use this component to conditionally render child components.

### [Consent](./src/components/consent)

This component adds Chakra UI's [color mode](https://chakra-ui.com/docs/features/color-mode) to the popular [react-cookie-consent](https://www.npmjs.com/package/react-cookie-consent) library.

### [Dialogues](./src/components/dialogues)

There is a single higher order component here that provides a mechanism to provide a responsive dialogue, that will toggle off a portion of it's content responsively.

### [Errors](./src/components/errors)

This folder contains components that handle run time errors, by way of error boundaries. The [react-error-boundary](https://www.npmjs.com/package/react-error-boundary?activeTab=dependencies) is extended and incorporated into the component ecosystem.

### [Head](./src/components/errors)

This component is rendered inside each next.js page to provide the top level headers.

### [Header](./src/components/header)

This component is rendered inside each next.js page to provide the top level headers. (See the [root provider](./src/providers/root.provider.tsx).)

### [Highlight](./src/components/errors)

This component is simply meant to show text inside a contrasted box that makes it stand out against the component background. It works well inside the [Billboard](./src/components/billboard) component.

### [Highlight](./src/components/errors)

This component is simply meant to show text inside a contrasted box that makes it stand out against the component background. It works well inside the [Billboard](./src/components/billboard) component.

### [NavBar](./src/components/navbar)

This folder contains a series of components that come together to create a response NavBar. This is fairly easy to extend and customize.

Take note of the [navbar.fetch.hook.tsx](./src/components/navbar/navbar.fetch.hook.tsx) file. You likely don't want the navbar to be navigable during data fetching, so this hook can be replaced with your own fetch hook so you can disable navigation at opportune times.

There is also a [hook](./src/hooks/navbar.ts) available you can use to hide or show the navbar for responsive purposes inside other components (ie. forms that take up the full screen.)

### [PopUps](./src/components/popups)

[Chakra UI](https://chakra-ui.com) has an awesome PopUp dialogue component, but it doesn't support colour mode. This folder contains components to overcome that. There is an example FeedBack popup that can be displayed to link to a feedback collection page.

The PopUps are all controlled by this [hook](./src/hooks/ui.ts), and are instantiated globally on each page [here](./src/pages/_app.tsx)

### [Styles](./src/components/styles)

[Chakra UI](https://chakra-ui.com) uses [@emotion/styled](https://emotion.sh/docs/@emotion/styled) under the covers to provide a method to customize built ins. This folder contains customized components that have been generated by this method.

## Events (Analytics)

There is a base events class here that encapsulates all analytics events.

This project uses the [react-ga](https://www.npmjs.com/package/react-ga) library for analytics, and this class represents the actual event data that is transmitted to Google.

If you're swapping in your own analytics solution, you may want to modify/replace this class.

## Hooks

### [analytics](./src/hooks/analytics.ts)

This hook exposes methods to work with the [react-ga](https://www.npmjs.com/package/react-ga) library. It's used by the [Consent](./src/components/consent) component to setup analytics, and all the other analytics based components.

The Google Analytics configuration itself is controlled by an [environment variable](./types.d/environment.d.ts).

### [colour](./src/hooks/colour.ts)

This Canadian spelled hook controls the colour theming of the application. I found it easier to centrally manage colours here rather than creating multiple of Box, Text variants.

This hook supports color mode, and is easily extendable. Simple render this hook inside components you wish to colour match, and use the calculated colour values in your style props.

### [navbar](./src/hooks/navbar.ts)

This hook exposes methods to hide and show the navbar for responsive purposes inside other components (ie. forms that take up the full screen.)

### [navbar.fetch.hook](./src/components/navbar/navbar.fetch.hook.tsx)

You likely don't want the navbar to be navigable during data fetching, so this hook can be replaced with your own fetch hook so you can disable navigation at opportune times.

### [ui](./src/hooks/ui.ts)

This hooks contains a couple of methods to manage popups and a handy counter that can be used while loading images. (For example you may not want to render a component, until it has loaded all 10 images...)
