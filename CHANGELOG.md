# [1.7.0](https://github.com/markpad/markpad/compare/v1.6.2...v1.7.0) (2026-04-07)


### Features

* **themes:** add 10 new preset themes ([67a92f1](https://github.com/markpad/markpad/commit/67a92f12fada9da09124b0eb835a439adc97070d)), closes [#33](https://github.com/markpad/markpad/issues/33)

## [1.6.2](https://github.com/markpad/markpad/compare/v1.6.1...v1.6.2) (2026-04-07)


### Bug Fixes

* **header:** allow editing document title on mobile ([e227c27](https://github.com/markpad/markpad/commit/e227c278ddb4277348ee9e7223cbbc3a64afdb44))
* **header:** duplicate in /new opens ephemeral tab ([87c7ef5](https://github.com/markpad/markpad/commit/87c7ef519836d83b4a8597df44ddf05f9c55b75b))
* **markdown:** preserve theme line-height on GFM task lists ([8b70e3b](https://github.com/markpad/markpad/commit/8b70e3b16094a21efaf9ff2c05a13d36d69f936c))
* **router:** restore list scroll position on back/forward ([2cd4b87](https://github.com/markpad/markpad/commit/2cd4b87f31c4917aff52d91fe546ac75acadf71b))
* **themes:** correct notebook paper preview and english sample text ([6aa7e68](https://github.com/markpad/markpad/commit/6aa7e686fa5174927122cb2bbe670804c3606904))

## [1.6.1](https://github.com/markpad/markpad/compare/v1.6.0...v1.6.1) (2026-04-07)


### Bug Fixes

* **try-mode:** preserve selected theme when saving from /new ([736e7a4](https://github.com/markpad/markpad/commit/736e7a49cfe6c56d0cd797e752d51072c902e536))

# [1.6.0](https://github.com/markpad/markpad/compare/v1.5.1...v1.6.0) (2026-04-06)


### Features

* migrate ephemeral editor flow to /new route ([326cabb](https://github.com/markpad/markpad/commit/326cabbb820cc039380063daa449ff545c5dcad7)), closes [#32](https://github.com/markpad/markpad/issues/32)

## [1.5.1](https://github.com/markpad/markpad/compare/v1.5.0...v1.5.1) (2026-04-06)


### Bug Fixes

* **editor:** correct visual line numbers on wrap and delete ([767b298](https://github.com/markpad/markpad/commit/767b29859c4592a3bbb4302f85c457965b880514))

# [1.5.0](https://github.com/markpad/markpad/compare/v1.4.0...v1.5.0) (2026-04-06)


### Bug Fixes

* **mobile:** respect safe-area for editor footer controls ([03ef4aa](https://github.com/markpad/markpad/commit/03ef4aa42e0a0e184c6a8c6f6101ca9c87b60def))
* **share:** match published typography and baseline with editor ([e3100e3](https://github.com/markpad/markpad/commit/e3100e323d653d77bde15c0772044311f19c08dd))


### Features

* **theme:** add notebook paper preset ([9847d2c](https://github.com/markpad/markpad/commit/9847d2c7957d3537fc86b8828a48fd77c4428431))

# [1.4.0](https://github.com/markpad/markpad/compare/v1.3.0...v1.4.0) (2026-04-05)


### Features

* **editor:** redesign mobile editor shell and navigation ([84a0467](https://github.com/markpad/markpad/commit/84a0467c226926eacfb99c791d6acc1bf6515110))

# [1.3.0](https://github.com/markpad/markpad/compare/v1.2.0...v1.3.0) (2026-03-29)


### Features

* **typography:** add heading font family support across editor, preview, and export ([c79ff30](https://github.com/markpad/markpad/commit/c79ff30db50ccf987629796f6dc71ebf0efb304f))

# [1.2.0](https://github.com/markpad/markpad/compare/v1.1.0...v1.2.0) (2026-03-29)


### Bug Fixes

* **storybook:** remove stale ThemeCard story ([2a78ceb](https://github.com/markpad/markpad/commit/2a78ceb5223dd009bd2758bd2420e89348b85591))


### Features

* **themes:** add landing-page preset for marketing content ([916457e](https://github.com/markpad/markpad/commit/916457e0a4e221b2accf761caf785f7451099e6f))
* **themes:** improve dark-mode styling and unify theme preview rendering ([387e0ba](https://github.com/markpad/markpad/commit/387e0ba6012dce22bec166042734ccb03539f25a))

# [1.1.0](https://github.com/markpad/markpad/compare/v1.0.0...v1.1.0) (2026-03-29)


### Bug Fixes

* **theme:** change style from 'brutalist' to 'default' in Comic Book theme preview ([110c9c1](https://github.com/markpad/markpad/commit/110c9c1c15016ee9412840d092d416e73de988aa))


### Features

* **theme:** enhance ThemeCard and ThemeCardCompact stories with argTypes and improved rendering logic ([d432730](https://github.com/markpad/markpad/commit/d432730e1865c3392afcd2defcc35663c2a4108c))

# 1.0.0 (2026-03-28)


### Bug Fixes

* add missing useEffect dependency in LoopModal ([8297a0c](https://github.com/markpad/markpad/commit/8297a0c9e2997035d07c71ef4efdb44bf268d8b3))
* correct ImportModal footer JSX and repo.create call ([5b67648](https://github.com/markpad/markpad/commit/5b67648eb4e8173486a3bfc66b263b17f940d045))
* **deps:** add missing peer deps and remove stale yarn.lock ([78617bf](https://github.com/markpad/markpad/commit/78617bf0019fc3ae59db6e9a24f661917c5cee3a))
* disable exhaustive-deps warning for intentional useEffect behavior in LoopModal ([ab38064](https://github.com/markpad/markpad/commit/ab38064234c53400b6d20140b5fbf54f6cc07eea))
* disable unused eslint rule ([1a3faa2](https://github.com/markpad/markpad/commit/1a3faa257fd5b395b7639fb69bc548b1a3008e01))
* **editor:** preserve scroll on toolbar actions and prevent frontmatter content corruption ([b247972](https://github.com/markpad/markpad/commit/b24797256aca3779975686ca72e9d7a25eb06c93)), closes [#30](https://github.com/markpad/markpad/issues/30)
* **editor:** smooth sidebar open and close transitions ([67280a3](https://github.com/markpad/markpad/commit/67280a3ee0a3ed030cd736b1a2e6271a338b72d1))
* fix ClassesSelector behavior ([d68ee13](https://github.com/markpad/markpad/commit/d68ee1391913d80e05fa87350652d686c7d99999))
* fix cursor position ([50e1a91](https://github.com/markpad/markpad/commit/50e1a917226af0c4dd1d6208705ccadfd98bd276))
* fix highlight ([fbfd07c](https://github.com/markpad/markpad/commit/fbfd07ce9e2ebcb1b6a5b973fb06c26f58e0153d))
* hide divider label text in menu dropdowns ([9b04f42](https://github.com/markpad/markpad/commit/9b04f4228523778f1e43343a87f97f3665f07f50))
* include newArrayConfig.items in useEffect dependencies ([5785314](https://github.com/markpad/markpad/commit/5785314e00d867ef99441de62ea6e85914be5662))
* move deployment file ([36202dd](https://github.com/markpad/markpad/commit/36202dd7e5bd342028edd9a06c5b60071eb4355f))
* prevent blank lines between loop items ([7ab275e](https://github.com/markpad/markpad/commit/7ab275eb7f55b788af2425f3f590d8bcbb364536))
* remove HTML Simple from ExportPanel sidebar ([0fed2f9](https://github.com/markpad/markpad/commit/0fed2f91d2bc8c421b1de443f954f3a80cfd64a2))
* remove Tailwind CDN to fix dark mode in production ([e3b8216](https://github.com/markpad/markpad/commit/e3b8216da40d9e0bc01922d1979f28b90b5a54fb))
* remove unused handleCreateCustomTheme function ([f04a02f](https://github.com/markpad/markpad/commit/f04a02f6be080d3bd9a3951a247062332653c338))
* remove unused import from LoopModal test file ([e8f928e](https://github.com/markpad/markpad/commit/e8f928ecf6e84368731b0f59391de9de4bcf9530))
* resolve build errors for CI ([a23e6de](https://github.com/markpad/markpad/commit/a23e6de253cf00e3ac335eb0d78291cb8ca4e905))
* **tests:** replace jest globals with vi, fix mock isolation ([23e0ee7](https://github.com/markpad/markpad/commit/23e0ee718bdc93d0d9ec37961903d1cda01e7ce4))
* update semantic-release dependencies to use exact versions ([71c15ba](https://github.com/markpad/markpad/commit/71c15babfdc7fe4eb08471b47db0662bfaf5538e))
* update semantic-release dependencies to use exact versions ([59be0c3](https://github.com/markpad/markpad/commit/59be0c36d57eb7a515339b933e572c18e1876c76))
* **worker:** preserve h1 heading in clipped articles ([ddb005c](https://github.com/markpad/markpad/commit/ddb005cf91d14ecf4cfc49db440d53866cde98ed))


### Code Refactoring

* **themes:** separate config from examples and remove behavior from theme presets ([56af6de](https://github.com/markpad/markpad/commit/56af6deb46659ffd1fa868a951d0d93c47c78869))


### Features

* add 3 dark mode adaptive themes and improve UX ([e645b3c](https://github.com/markpad/markpad/commit/e645b3c7a037cf0fbb738f8090a13de313af9b91))
* add conditional template support with if/else/endif blocks ([5351073](https://github.com/markpad/markpad/commit/535107375e1fb7149a3babcc3fe2d202911d5306))
* add dark mode support to standard-blue theme ([42d3823](https://github.com/markpad/markpad/commit/42d38230cfe34a7bd4650532e34630895ab5589d))
* add dark mode to editor, publish page and all UI components ([4e2f6ed](https://github.com/markpad/markpad/commit/4e2f6ed44984f0af6578b4f8a9dbdc17c9e203ec))
* add document title persistence to state ([485724c](https://github.com/markpad/markpad/commit/485724c8386e4e9a45c0769c2fc68a67b513939b))
* add frontmatter support with variable interpolation ([58d0cd6](https://github.com/markpad/markpad/commit/58d0cd69d22c006f27b5a191dc6b756abde9acf0)), closes [#16](https://github.com/markpad/markpad/issues/16)
* add function to fix blank lines in markdown tables ([2cc2f6b](https://github.com/markpad/markpad/commit/2cc2f6b3159a966c829b0004e69df5c410546b39))
* add gradient to bar ([e901fa4](https://github.com/markpad/markpad/commit/e901fa49e89436350a16a14ac5a96c5ed0aea5f3))
* add history management and search functionality to image and link modals ([6cd5843](https://github.com/markpad/markpad/commit/6cd5843afe43881e9a2e5f8701fccd03678c9664))
* add IF conditional modal with comprehensive UI and tests ([e5d9a9c](https://github.com/markpad/markpad/commit/e5d9a9c3a692709454c77d5079a45e7551ded49d))
* add image insertion modal with preview functionality ([6ee1f2c](https://github.com/markpad/markpad/commit/6ee1f2c9af609d1e0605daca3f927adde757f47a))
* add import action options to ImportModal ([d53f352](https://github.com/markpad/markpad/commit/d53f3523f01ba96644da6e5c13b44bc1e1ee534f))
* add Import modal to Documents page ([8c68aa3](https://github.com/markpad/markpad/commit/8c68aa33e69b699ac78ef32d839131bb509848f6))
* add link insertion modal and theme handlers ([84f3b12](https://github.com/markpad/markpad/commit/84f3b12b5e430b4328e0806afddb0a9a8287d3e5))
* add loop support and download options ([3d5047e](https://github.com/markpad/markpad/commit/3d5047e253e8afbeaeddd81ed7012054147455e7)), closes [#17](https://github.com/markpad/markpad/issues/17)
* add metadata to the page ([8a2f729](https://github.com/markpad/markpad/commit/8a2f7295304fee1ae9615b2209d9eaf5325e1525))
* add more elements to settings page ([fa0cc4e](https://github.com/markpad/markpad/commit/fa0cc4ec1ab63b54fbcf3229daa0d734dbc56b2d))
* add New Document and Duplicate features ([4bbe09d](https://github.com/markpad/markpad/commit/4bbe09d5777d78de2364178b94f747f95df6c802))
* Add PDF export with theme-accurate rendering ([#26](https://github.com/markpad/markpad/issues/26)) ([993e349](https://github.com/markpad/markpad/commit/993e349d1a9dfecce2e1d152922d09be14516d64)), closes [#25](https://github.com/markpad/markpad/issues/25)
* add publish to web feature with download modal and toast notifications ([b677ed7](https://github.com/markpad/markpad/commit/b677ed7e9acad0f616b4f3fca41c0e43c59ce745))
* add sync scroll toggle and fix loop modal textarea ([cb4866c](https://github.com/markpad/markpad/commit/cb4866c6e5a8636cb6d300d760886fdc0385104a))
* add syntax highlighting to markdown editor ([057f035](https://github.com/markpad/markpad/commit/057f035dd4eb83463fa356c3231b8d4d9ece5a41)), closes [#20](https://github.com/markpad/markpad/issues/20)
* add visual theme editor with advanced styling controls ([#24](https://github.com/markpad/markpad/issues/24)) ([bc85ad7](https://github.com/markpad/markpad/commit/bc85ad708595d5b275d2d27e03e6af8b29ec5f72)), closes [#23](https://github.com/markpad/markpad/issues/23)
* adds striped table style ([876047c](https://github.com/markpad/markpad/commit/876047ce4eca8722b5f95c1b5a94010b417009b1))
* adiciona sistema de favoritos e salvamento de temas customizados ([6da46e5](https://github.com/markpad/markpad/commit/6da46e5dac5e899c19ec72533376cfd1df4cfac0))
* allow users to create new classes ([a8cc01e](https://github.com/markpad/markpad/commit/a8cc01e5ac27170fc11a005088fb67c0eef7a6a2))
* apply small UI improvements ([eb9762f](https://github.com/markpad/markpad/commit/eb9762f19a6a77ede270cedf4f465fcaa2e41017))
* change background color ([5c74d8b](https://github.com/markpad/markpad/commit/5c74d8b3d88bc7bf0cc719575b03d9d00b2e5fc1))
* change placeholder image ([246752a](https://github.com/markpad/markpad/commit/246752a95b77d36cf5cbc1c01e84d9620e593aec))
* change UI for classes selection ([34e2488](https://github.com/markpad/markpad/commit/34e2488350eb8075a63ebb2d781b2a4df89a35dd))
* close themes sidebar by default when opening /editor or /template routes ([888f9b8](https://github.com/markpad/markpad/commit/888f9b82f1919415347aa018db6b53717b375c9d))
* copy HTML with rich formatting to clipboard ([5b57b1d](https://github.com/markpad/markpad/commit/5b57b1d0006bf6db1a58215b0ecb80b535725f37))
* create landing page with hero section and features ([#13](https://github.com/markpad/markpad/issues/13)) ([c3d6105](https://github.com/markpad/markpad/commit/c3d6105e0c5167003e774458b83cda25f2f0b906))
* display some bar buttons together ([37ddcc3](https://github.com/markpad/markpad/commit/37ddcc3c9c247969e637022db6dd57f626b680d7))
* **editor:** add main Editor layout component ([f9ba9d2](https://github.com/markpad/markpad/commit/f9ba9d2b1761b44f15a1d1ee8c993aa8e0b35cf8))
* **editor:** add markdown editor component ([78a2c12](https://github.com/markpad/markpad/commit/78a2c129f14f2011a717c6d3c173ec4d313b277b))
* **editor:** reserve space for save status label to prevent layout shifts ([f256dcc](https://github.com/markpad/markpad/commit/f256dcc64035e8173c817ed93e16e4c0db35b221))
* enhance LoopModal and Editor components for improved loop insertion and cursor management ([0d6e55e](https://github.com/markpad/markpad/commit/0d6e55e295219e2eedbc5521181b4b66bd4f2b89))
* extract markdown templating to standalone lib ([0caf32d](https://github.com/markpad/markpad/commit/0caf32dd6f5c76cd2c05e4e220a328bfd6a00768))
* first version released ([ff17554](https://github.com/markpad/markpad/commit/ff1755462a6361a49c68cd560f5d10f96cabd6ee))
* **fonts:** add Bangers and Comic Neue to font selector list ([2a66079](https://github.com/markpad/markpad/commit/2a6607974fbfd3d663f95f856025d144e628df18))
* **header:** add application header component ([ecedbfe](https://github.com/markpad/markpad/commit/ecedbfe9d18d10ebe5a48764a5ed4522860184b1))
* **hooks:** add custom React hooks for editor and state management ([19e5bd9](https://github.com/markpad/markpad/commit/19e5bd93a46463081354eec5835b3727f67a2381))
* implement Google Docs-style menu hover behavior ([9abddab](https://github.com/markpad/markpad/commit/9abddab3cb50246c6a51990602c80ee005a46adc))
* improve ImportModal UX with progressive radio button interface ([958fcf3](https://github.com/markpad/markpad/commit/958fcf3809221df6e211fe0810fa7a2445e86c16))
* **preview:** add markdown preview component ([5f8072d](https://github.com/markpad/markpad/commit/5f8072d11ba0b96a832a518a57b2d281f15bf73e))
* reorganize menu bar with submenus and add unit tests ([6c1c661](https://github.com/markpad/markpad/commit/6c1c661f4d55125baae0b81e9d3793e5c24df951))
* **routing:** implement React Router navigation ([d92a1f7](https://github.com/markpad/markpad/commit/d92a1f7014ddc76cc88ccd918cddbf7230ab58db))
* **services:** add URL state management service ([53b0e22](https://github.com/markpad/markpad/commit/53b0e22194919a4706a2b6d6be9d40085f315c23))
* **sidebar:** add export panel with download options ([ffc46a1](https://github.com/markpad/markpad/commit/ffc46a14336655ce0122a1eeb0597e0f49f94aa5))
* **sidebar:** redesign style panel with theme gallery and Google Docs-style toggle ([c0db21c](https://github.com/markpad/markpad/commit/c0db21c7ae48bd76c2d2e2112833273731b16439))
* **style:** add style customization panel components ([547cdf5](https://github.com/markpad/markpad/commit/547cdf5c2b64dbcd11e2514b14821b7295ad80bd))
* **themes:** add accessibility themes (Dyslexia Friendly, Sepia) ([9b19b6e](https://github.com/markpad/markpad/commit/9b19b6e0a7e303eb9ef018d7481acfb0b5ae4878))
* **themes:** add Bangers and Comic Neue fonts for comic book theme ([0d8c9e8](https://github.com/markpad/markpad/commit/0d8c9e888a6661e5990c7536cd1e64b66bb34829))
* **themes:** add color scheme themes (Solarized, Dracula, Nord, Gruvbox, Monokai, Material, Cyberpunk, Retro Terminal) ([0d6b53f](https://github.com/markpad/markpad/commit/0d6b53f1f006526ead43be4446c411456194737e))
* **themes:** add comic book theme preset ([008e2e6](https://github.com/markpad/markpad/commit/008e2e683dcf4828291b7f4d7ef4ecceb4b0b765))
* **themes:** add community-inspired themes (GitHub README, Wikipedia) ([ff9b4ae](https://github.com/markpad/markpad/commit/ff9b4ae026adce22bb97615f67922ed2ef6b7092))
* **themes:** add contextual themes (Technical Docs, Blog Post, Newspaper, Resume/CV) ([daf7d93](https://github.com/markpad/markpad/commit/daf7d936184ce30d1e615cf2c9580dfcc1d99213))
* **themes:** add Flexoki theme ([ab0403d](https://github.com/markpad/markpad/commit/ab0403dd59db073621ee65e693cf9f663642f04c)), closes [#fffcf0](https://github.com/markpad/markpad/issues/fffcf0)
* **themes:** add theme gallery and card components ([22e5d7a](https://github.com/markpad/markpad/commit/22e5d7ad2dfbf167b41acf311a7500060e953882))
* **themes:** add theme system with markdown definitions ([d8cf95f](https://github.com/markpad/markpad/commit/d8cf95fddb002a8bd1003cde4c0c70f5f64db2b9))
* **types:** add core TypeScript types and interfaces ([b49ab83](https://github.com/markpad/markpad/commit/b49ab836a2d26e661a621a66e647ab8dcccf6bae))
* unify visual design across Documents, Themes, and Templates pages ([4fda2ce](https://github.com/markpad/markpad/commit/4fda2cef3de3f9b4924dfc4eaedcbcc64c7944a0))
* update favicon and fix tailwind safelist configuration ([28991ba](https://github.com/markpad/markpad/commit/28991ba9cf47a05aad8b6f083bb37ead69a63fd8))
* Web Clipper — Import articles from URL via Cloudflare Worker ([#29](https://github.com/markpad/markpad/issues/29)) ([20175b6](https://github.com/markpad/markpad/commit/20175b683950c750dc6ce8bded1b8db5e4de58fa)), closes [#28](https://github.com/markpad/markpad/issues/28)


### BREAKING CHANGES

* **themes:** ThemePreset no longer contains behaviorConfig property
