var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-chat/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.customLinkStyle = exports.messageStyle = exports.imageStyle = exports.storageModalStyle = exports.messagePanelStyle = void 0;
    exports.messagePanelStyle = components_1.Styles.style({
        $nest: {
            '> *:first-child': {
                marginTop: 'auto'
            }
        }
    });
    exports.storageModalStyle = components_1.Styles.style({
        $nest: {
            '.modal > div:nth-child(2)': {
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            },
            'i-scom-storage': {
                display: 'block',
                width: '100%',
                height: 'calc(100% - 1.5rem)',
                overflow: 'hidden'
            }
        }
    });
    exports.imageStyle = components_1.Styles.style({
        transform: 'translateY(-100%)',
        $nest: {
            '&>img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
            }
        }
    });
    exports.messageStyle = components_1.Styles.style({
        $nest: {
            '> i-scom-markdown-editor:first-child .toastui-editor-contents p': {
                marginBlockStart: 0
            },
            '> i-scom-markdown-editor:last-child .toastui-editor-contents p': {
                marginBlockEnd: 0
            },
            '> i-label + i-scom-markdown-editor .toastui-editor-contents p': {
                marginBlockStart: 0
            }
        }
    });
    exports.customLinkStyle = components_1.Styles.style({
        $nest: {
            'i-link': {
                display: `inline !important`,
            },
            'img': {
                maxWidth: '100%'
            }
        }
    });
});
define("@scom/scom-chat/components/loadingSpinner.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoadingSpinner = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    let LoadingSpinner = class LoadingSpinner extends components_2.Module {
        init() {
            super.init();
        }
        setProperties(value) {
            this.pnlLoadingSpinner.height = value.height || '100%';
            this.pnlLoadingSpinner.top = value.top || 0;
            this.pnlLoadingSpinner.minHeight = value.minHeight == null ? 200 : value.minHeight;
            this.pnlLoadingSpinner.style.background = value.background || Theme.background.default;
            this.pnlLoadingSpinner.zIndex = value.zIndex || 899;
        }
        render() {
            return (this.$render("i-vstack", { id: "pnlLoadingSpinner", width: "100%", minHeight: 200, position: "absolute", bottom: 0, zIndex: 899, background: { color: Theme.background.main }, class: "i-loading-overlay", mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            height: 'calc(100% - 3.125rem)',
                            top: 0
                        }
                    }
                ] },
                this.$render("i-vstack", { horizontalAlignment: "center", verticalAlignment: "center", position: "absolute", top: "calc(50% - 0.75rem)", left: "calc(50% - 0.75rem)" },
                    this.$render("i-icon", { class: "i-loading-spinner_icon", name: "spinner", width: 24, height: 24, fill: Theme.colors.primary.main }))));
        }
    };
    LoadingSpinner = __decorate([
        (0, components_2.customElements)('i-scom-chat--loading-spinner')
    ], LoadingSpinner);
    exports.LoadingSpinner = LoadingSpinner;
});
define("@scom/scom-chat/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MediaType = void 0;
    var MediaType;
    (function (MediaType) {
        MediaType["Image"] = "image";
        MediaType["Video"] = "video";
    })(MediaType = exports.MediaType || (exports.MediaType = {}));
});
define("@scom/scom-chat/utils.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.constructMessage = exports.groupMessage = exports.createLabelElements = exports.getEmbedElement = exports.getMessageTime = exports.getPublicIndexingRelay = exports.getUserProfile = exports.isDevEnv = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    function isDevEnv() {
        return components_3.application.store.env === 'dev';
    }
    exports.isDevEnv = isDevEnv;
    function getUserProfile() {
        return components_3.application.store.userProfile;
    }
    exports.getUserProfile = getUserProfile;
    function getPublicIndexingRelay() {
        return components_3.application.store.publicIndexingRelay;
    }
    exports.getPublicIndexingRelay = getPublicIndexingRelay;
    function getMessageTime(time) {
        const targetDate = components_3.moment.unix(time);
        const currentDate = (0, components_3.moment)(new Date());
        if (targetDate.year() < currentDate.year()) {
            return targetDate.format("DD MMM YYYY, hh:mm A");
        }
        if (targetDate.month() < currentDate.month() || targetDate.date() < currentDate.date()) {
            return targetDate.format("DD MMM, hh:mm A");
        }
        return targetDate.format("hh:mm A");
    }
    exports.getMessageTime = getMessageTime;
    function getThemeValues(theme) {
        if (!theme || typeof theme !== 'object')
            return null;
        let values = {};
        for (let prop in theme) {
            if (theme[prop])
                values[prop] = theme[prop];
        }
        return Object.keys(values).length ? values : null;
    }
    async function getEmbedElement(postData, parent, callback) {
        const { module, data } = postData;
        const elm = await components_3.application.createElement(module, true);
        if (!elm)
            throw new Error('not found');
        elm.parent = parent;
        if (elm.ready)
            await elm.ready();
        const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf) => conf.target === 'Builders' || conf.target === 'Editor') : null;
        elm.maxWidth = '100%';
        elm.maxHeight = '100%';
        if (builderTarget?.setData && data.properties) {
            await builderTarget.setData(data.properties);
        }
        const { dark, light } = data.properties || {};
        let tag = {};
        const darkTheme = getThemeValues(dark);
        const lightTheme = getThemeValues(light);
        if (darkTheme) {
            tag['dark'] = darkTheme;
        }
        if (lightTheme) {
            tag['light'] = lightTheme;
        }
        tag = { ...tag, ...data.tag };
        if (builderTarget?.setTag && Object.keys(tag).length) {
            await builderTarget.setTag(tag);
        }
        if (callback)
            callback(elm);
        return elm;
    }
    exports.getEmbedElement = getEmbedElement;
    function createLabelElements(text, styles) {
        const linkRegex = /https?:\/\/\S+/gi;
        const elements = [];
        let match;
        const matches = [];
        const labelStyles = {
            display: 'inline',
            overflowWrap: 'break-word',
            font: { size: '0.875rem', weight: 400 },
            lineHeight: '1.25rem',
            padding: { right: '4px' },
            ...(styles || {})
        };
        while ((match = linkRegex.exec(text)) !== null) {
            matches.push({
                type: 'link',
                index: match.index,
                length: match[0].length,
                data: { url: match[0], caption: match[0] }
            });
        }
        matches.sort((a, b) => a.index - b.index);
        let lastIndex = 0;
        matches.forEach(match => {
            if (match.index > lastIndex) {
                const textContent = text.slice(lastIndex, match.index);
                if (textContent.trim().length > 0) {
                    elements.push(new components_3.Label(undefined, {
                        caption: textContent,
                        ...labelStyles
                    }));
                }
            }
            if (match.type === 'link') {
                const link = new components_3.Label(undefined, {
                    link: { href: match.data.url, target: '_blank' },
                    caption: match.data.caption,
                    ...labelStyles,
                    font: { color: Theme.colors.primary.main, size: '0.875rem', weight: 400 }
                });
                elements.push(link);
            }
            lastIndex = match.index + match.length;
        });
        if (lastIndex < text.length) {
            let textContent = text.slice(lastIndex);
            if (textContent.trim().length > 0) {
                elements.push(new components_3.Label(undefined, {
                    caption: textContent,
                    ...labelStyles
                }));
            }
        }
        return elements;
    }
    exports.createLabelElements = createLabelElements;
    function groupMessage(messages) {
        const groupedMessage = [];
        let pubKey;
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (pubKey !== msg.sender) {
                groupedMessage.push({
                    sender: msg.sender,
                    pubKey: msg.pubKey,
                    messages: []
                });
            }
            groupedMessage[groupedMessage.length - 1].messages.push({
                contentElements: msg.contentElements,
                createdAt: msg.createdAt
            });
            pubKey = msg.sender;
        }
        return groupedMessage;
    }
    exports.groupMessage = groupMessage;
    function createTextElement(text, isMarkdown = false) {
        return {
            module: isMarkdown ? '@scom/scom-markdown-editor' : null,
            data: {
                properties: {
                    content: text,
                },
                tag: {
                    width: '100%',
                    pt: 0,
                    pb: 0,
                    pl: 0,
                    pr: 0,
                },
            },
        };
    }
    function extractMediaFromContent(content, metadataByPubKeyMap, eventData) {
        const elements = [];
        let textContent = content.slice();
        if (textContent.trim().length > 0) {
            elements.push(createTextElement(textContent));
        }
        return elements;
    }
    function constructMessage(content, metadataByPubKeyMap) {
        const messageElementData = extractMediaFromContent(content, metadataByPubKeyMap);
        return messageElementData;
    }
    exports.constructMessage = constructMessage;
});
define("@scom/scom-chat/components/mediaPreview.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-chat/interface.ts", "@scom/scom-chat/utils.ts"], function (require, exports, components_4, interface_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChatMediaPreview = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomChatMediaPreview = class ScomChatMediaPreview extends components_4.Module {
        addMedia(type, url) {
            if (type === interface_1.MediaType.Image) {
                this.addImage(url);
            }
            else {
                this.addVideo(url);
            }
        }
        addImage(url) {
            const img = document.createElement('img');
            img.src = url;
            img.style.minWidth = '9rem';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.display = 'block';
            this.pnlMediaPreview.appendChild(img);
        }
        addVideo(url) {
            const elementData = {
                module: '@scom/scom-video',
                data: {
                    properties: {
                        url: url,
                    },
                    tag: {
                        width: '100%'
                    },
                },
            };
            (0, utils_1.getEmbedElement)(elementData, this.pnlMediaPreview);
        }
        handleRemoveMedia() {
            if (this.onRemoveMedia)
                this.onRemoveMedia();
        }
        init() {
            super.init();
            const type = this.getAttribute('type', true);
            const url = this.getAttribute('url', true);
            if (type && url) {
                this.addMedia(type, url);
            }
        }
        render() {
            this.$render("i-panel", { id: "pnlMediaPreview", position: "relative", height: "9rem", width: "fit-content", overflow: "hidden", border: { radius: '1rem' }, margin: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-hstack", { position: "absolute", width: "2rem", height: "2rem", top: "0.25rem", right: "0.25rem", border: { radius: '50%' }, horizontalAlignment: "center", verticalAlignment: "center", cursor: "pointer", zIndex: 1, background: { color: Theme.colors.secondary.main }, hover: { backgroundColor: Theme.action.hoverBackground }, onClick: this.handleRemoveMedia },
                    this.$render("i-icon", { width: "1rem", height: "1rem", name: 'times' })));
        }
    };
    ScomChatMediaPreview = __decorate([
        (0, components_4.customElements)('i-scom-chat--media-preview')
    ], ScomChatMediaPreview);
    exports.ScomChatMediaPreview = ScomChatMediaPreview;
});
define("@scom/scom-chat/model.ts", ["require", "exports", "@ijstech/components", "@scom/scom-chat/utils.ts"], function (require, exports, components_5, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    class Model {
        constructor() {
            this._extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'tiff', 'tif', 'mp4', 'webm', 'ogg', 'avi', 'mkv', 'mov', 'm3u8'];
            this._isGroup = false;
            this._widgetMap = new Map(); // eventId: module
        }
        get extensions() {
            return this._extensions;
        }
        get imageExtensions() {
            return this._extensions.slice(0, 8);
        }
        get interlocutor() {
            return this._data.interlocutor;
        }
        get isGroup() {
            return this._isGroup;
        }
        set isGroup(value) {
            this._isGroup = value;
        }
        get metadataByPubKeyMap() {
            return this._data.metadataByPubKeyMap;
        }
        set metadataByPubKeyMap(map) {
            this._data.metadataByPubKeyMap = map;
        }
        get dataManager() {
            return components_5.application.store?.mainDataManager;
        }
        get widgetMap() {
            return this._widgetMap;
        }
        getData() {
            return this._data;
        }
        async setData(value) {
            this._data = value;
        }
        async fetchPaymentReceiptInfo(paymentRequest) {
            const info = await this.dataManager.fetchPaymentReceiptInfo(paymentRequest);
            return info;
        }
        async sendTempMessage(receiverId, message, replyToEventId, widgetId) {
            const userProfile = (0, utils_2.getUserProfile)();
            await this.dataManager.sendPingRequest(userProfile.pubkey, (0, utils_2.getPublicIndexingRelay)());
            const event = await this.dataManager.sendTempMessage({
                receiverId,
                message,
                replyToEventId,
                widgetId
            });
            return event;
        }
    }
    exports.Model = Model;
});
define("@scom/scom-chat/components/messageComposer.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-storage", "@scom/scom-gif-picker", "@scom/scom-chat/components/mediaPreview.tsx", "@scom/scom-chat/index.css.ts", "@scom/scom-chat/interface.ts", "@scom/scom-chat/utils.ts"], function (require, exports, components_6, scom_storage_1, scom_gif_picker_1, mediaPreview_1, index_css_1, interface_2, utils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChatMessageComposer = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    let ScomChatMessageComposer = class ScomChatMessageComposer extends components_6.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        proccessFile() {
            if (!this.scomStorage) {
                this.scomStorage = scom_storage_1.ScomStorage.getInstance();
                this.scomStorage.onCancel = () => {
                    this.scomStorage.closeModal();
                };
            }
            this.scomStorage.uploadMultiple = false;
            this.scomStorage.onUploadedFile = (path) => {
                const ext = path.split('.').pop().toLowerCase();
                if (this.model.extensions.includes(ext)) {
                    this.mediaUrl = path;
                    const type = this.model.imageExtensions.includes(ext) ? interface_2.MediaType.Image : interface_2.MediaType.Video;
                    this.addMedia(type, path);
                    this.scomStorage.closeModal();
                    this.pnlAttachment.visible = false;
                }
            };
            this.scomStorage.onOpen = (path) => {
                const ext = path.split('.').pop().toLowerCase();
                if (this.model.extensions.includes(ext)) {
                    this.mediaUrl = path;
                    const type = this.model.imageExtensions.includes(ext) ? interface_2.MediaType.Image : interface_2.MediaType.Video;
                    this.addMedia(type, path);
                    this.scomStorage.closeModal();
                    this.pnlAttachment.visible = false;
                }
            };
            this.scomStorage.openModal({
                width: 800,
                maxWidth: '100%',
                height: '90vh',
                overflow: 'hidden',
                zIndex: 1002,
                closeIcon: { width: '1rem', height: '1rem', name: 'times', fill: Theme.text.primary, margin: { bottom: '0.5rem' } },
                class: index_css_1.storageModalStyle
            });
            this.scomStorage.onShow();
        }
        handleAttachmentClick() {
            this.mdAttachment.visible = true;
        }
        handleEmojiClick() {
            this.emojiPicker.clearSearch();
            this.mdEmoji.visible = true;
        }
        handelGifClick() {
            if (!this.gifPicker) {
                this.gifPicker = new scom_gif_picker_1.ScomGifPicker();
                this.gifPicker.onGifSelected = this.onGifSelected.bind(this);
                this.gifPicker.onClose = () => this.gifPicker.closeModal();
            }
            const modal = this.gifPicker.openModal({
                maxWidth: '600px',
                height: '90vh',
                overflow: { y: 'auto' },
                padding: { top: 0, right: 0, left: 0, bottom: 0 },
                border: { radius: '1rem' },
                closeIcon: null,
                mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            showBackdrop: true,
                            popupPlacement: 'top',
                            position: 'fixed',
                            zIndex: 999,
                            maxWidth: '100%',
                            height: '100%',
                            width: '100%',
                            border: { radius: 0 }
                        }
                    }
                ],
                zIndex: 102,
                onOpen: this.gifPicker.show.bind(this.gifPicker),
                onClose: this.gifPicker.clear.bind(this.gifPicker)
            });
            modal.closeIcon = null;
            this.mdAttachment.visible = false;
        }
        handleKeyDown(target, event) {
            if (event.key === "Enter" && (event.ctrlKey || event.shiftKey || event.metaKey))
                return;
            if (event.key === "Enter") {
                event.preventDefault();
            }
            if (event.key !== "Enter")
                return;
            this.handleSubmit(target, event);
        }
        async submitMessage(event) {
            const gifUrl = this.gifUrl;
            const message = this.edtMessage.value.trim();
            let mediaUrls = [];
            if (this.mediaUrl)
                mediaUrls.push(this.mediaUrl);
            if (gifUrl)
                mediaUrls.push(gifUrl);
            if (!message.length && !mediaUrls.length)
                return;
            if (this.onSubmit)
                await this.onSubmit(message, mediaUrls, event);
            this.removeMedia();
        }
        async handleSubmit(target, event) {
            try {
                this.submitMessage(event);
                this.edtMessage.value = "";
                this.edtMessage.height = 'auto';
            }
            catch (err) {
                console.error(err);
            }
        }
        addMedia(type, url) {
            this.pnlPreview.clearInnerHTML();
            const mediaPreview = new mediaPreview_1.ScomChatMediaPreview(undefined, {
                type: type,
                url: url,
                onRemoveMedia: this.removeMedia.bind(this)
            });
            this.pnlPreview.appendChild(mediaPreview);
        }
        removeMedia() {
            this.mediaUrl = "";
            this.gifUrl = "";
            this.pnlPreview.clearInnerHTML();
            this.pnlPreview.visible = false;
            this.pnlAttachment.visible = (0, utils_3.isDevEnv)();
        }
        handleSelectedEmoji(value) {
            this.edtMessage.value = this.edtMessage.value + value;
        }
        onGifSelected(gif) {
            const url = gif.images.original.url;
            this.gifUrl = url;
            const smallUrl = gif.images.preview_webp.url;
            this.addMedia(interface_2.MediaType.Image, smallUrl);
            this.gifPicker.closeModal();
        }
        init() {
            super.init();
            this.pnlAttachment.visible = (0, utils_3.isDevEnv)();
        }
        render() {
            return (this.$render("i-vstack", { background: { color: Theme.input.background }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, border: { radius: '1rem' }, mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            padding: { top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }
                        }
                    }
                ] },
                this.$render("i-panel", { id: "pnlPreview", minHeight: "auto", visible: false }),
                this.$render("i-hstack", { width: "100%", verticalAlignment: "center", gap: "4px" },
                    this.$render("i-hstack", { id: "pnlAttachment", position: "relative", width: "2rem", height: "2rem", border: { radius: '50%' }, horizontalAlignment: "center", verticalAlignment: "center", cursor: "pointer", hover: { backgroundColor: "#C16FFF26" }, tooltip: { content: '$attachment', placement: 'top' }, onClick: this.handleAttachmentClick },
                        this.$render("i-icon", { width: "1rem", height: "1rem", name: 'paperclip', fill: "#C16FFF" }),
                        this.$render("i-modal", { id: "mdAttachment", maxWidth: "15rem", minWidth: "12.25rem", maxHeight: "27.5rem", popupPlacement: 'topLeft', showBackdrop: false, border: { radius: '1rem' }, boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px', padding: { top: 0, left: 0, right: 0, bottom: 0 }, margin: { bottom: '0.25rem' }, closeOnScrollChildFixed: true, overflow: { y: 'hidden' }, visible: false },
                            this.$render("i-vstack", null,
                                this.$render("i-hstack", { verticalAlignment: "center", width: "100%", padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }, border: { radius: '0.125rem' }, gap: "0.75rem", cursor: "pointer", hover: {
                                        fontColor: Theme.text.primary,
                                        backgroundColor: Theme.action.hoverBackground
                                    }, onClick: this.proccessFile, mediaQueries: [
                                        {
                                            maxWidth: '767px',
                                            properties: {
                                                padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }
                                            }
                                        }
                                    ] },
                                    this.$render("i-hstack", { width: "2rem", height: "2rem", horizontalAlignment: "center", verticalAlignment: "center", tooltip: { content: '$media', placement: 'top' } },
                                        this.$render("i-icon", { width: "1rem", height: "1rem", name: 'image', fill: "#C16FFF" })),
                                    this.$render("i-label", { caption: "$media", font: { color: Theme.colors.secondary.light, weight: 400, size: '0.875rem' } })),
                                this.$render("i-hstack", { verticalAlignment: "center", width: "100%", padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }, border: { radius: '0.125rem' }, gap: "0.75rem", cursor: "pointer", hover: {
                                        fontColor: Theme.text.primary,
                                        backgroundColor: Theme.action.hoverBackground
                                    }, onClick: this.handelGifClick, mediaQueries: [
                                        {
                                            maxWidth: '767px',
                                            properties: {
                                                padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }
                                            }
                                        }
                                    ] },
                                    this.$render("i-hstack", { width: "2rem", height: "2rem", horizontalAlignment: "center", verticalAlignment: "center", tooltip: { content: '$media', placement: 'top' } },
                                        this.$render("i-icon", { width: "1rem", height: "1rem", name: 'images', fill: "#C16FFF" })),
                                    this.$render("i-label", { caption: "$gif", font: { color: Theme.colors.secondary.light, weight: 400, size: '0.875rem' } }))))),
                    this.$render("i-hstack", { width: "2rem", height: "2rem", position: "relative" },
                        this.$render("i-hstack", { width: "2rem", height: "2rem", border: { radius: '50%' }, horizontalAlignment: "center", verticalAlignment: "center", cursor: "pointer", hover: { backgroundColor: "#C16FFF26" }, tooltip: { content: '$emoji', placement: 'top' }, onClick: this.handleEmojiClick },
                            this.$render("i-icon", { width: "1rem", height: "1rem", name: 'smile', fill: "#C16FFF" })),
                        this.$render("i-modal", { id: "mdEmoji", width: "20rem", popupPlacement: 'topLeft', showBackdrop: false, border: { radius: '1rem' }, boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px', padding: { top: 0, left: 0, right: 0, bottom: 0 }, margin: { bottom: '0.25rem' }, closeOnScrollChildFixed: true, overflow: { y: 'hidden' }, visible: false },
                            this.$render("i-scom-emoji-picker", { id: "emojiPicker", onEmojiSelected: this.handleSelectedEmoji }))),
                    this.$render("i-hstack", { verticalAlignment: "center", stack: { grow: "1" } },
                        this.$render("i-input", { id: "edtMessage", width: "100%", height: "auto", maxHeight: 130, display: "flex", rows: 1, padding: { left: '0.25rem', right: '0.25rem' }, border: { style: 'none' }, placeholder: "$type_a_message", inputType: "textarea", resize: 'auto-grow', onKeyDown: this.handleKeyDown })),
                    this.$render("i-hstack", { width: "2rem", height: "2rem", border: { radius: '50%' }, horizontalAlignment: "center", verticalAlignment: "center", cursor: "pointer", hover: { backgroundColor: "#C16FFF26" }, onClick: this.handleSubmit, tooltip: { content: '$send', placement: 'top' } },
                        this.$render("i-icon", { width: "1rem", height: "1rem", name: 'paper-plane', fill: "#C16FFF" })))));
        }
    };
    ScomChatMessageComposer = __decorate([
        (0, components_6.customElements)('i-scom-chat--message-composer')
    ], ScomChatMessageComposer);
    exports.ScomChatMessageComposer = ScomChatMessageComposer;
});
define("@scom/scom-chat/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_7.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-chat/components/thread.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-chat/utils.ts", "@scom/scom-chat/index.css.ts", "@scom/scom-chat/assets.ts"], function (require, exports, components_8, utils_4, index_css_2, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChatThreadMessage = exports.ScomChatThread = void 0;
    const Theme = components_8.Styles.Theme.ThemeVars;
    let ScomChatThread = class ScomChatThread extends components_8.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        addMessages(pubKey, info) {
            let isMyThread = pubKey === info.sender;
            this.pnlThread.padding = this.model.isGroup ? { left: '2.25rem', bottom: "1rem" } : { bottom: "1rem" };
            this.pnlThread.alignItems = isMyThread ? "end" : "start";
            this.pnlContent.alignItems = isMyThread ? "end" : "start";
            this.renderMessages(info, isMyThread, this.model.isGroup);
        }
        async renderMessages(info, isMyThread, isGroup) {
            const messages = info.messages;
            let showUserInfo = isGroup && !isMyThread;
            for (let i = 0; i < messages.length; i++) {
                const showMessageTime = messages[i + 1] ? components_8.moment.unix(messages[i + 1].createdAt).diff(components_8.moment.unix(messages[i].createdAt)) > 60000 : true;
                const threadMessage = new ScomChatThreadMessage();
                threadMessage.OnContentRendered = this.OnContentRendered;
                this.pnlContent.appendChild(threadMessage);
                await threadMessage.ready();
                threadMessage.setData(info.sender, info.pubKey, messages[i], isMyThread, showUserInfo);
                if (showMessageTime) {
                    const msgTime = (0, utils_4.getMessageTime)(messages[i].createdAt);
                    this.pnlContent.appendChild(this.$render("i-label", { caption: msgTime, font: { size: '0.8125rem', color: Theme.text.secondary }, lineHeight: "1.25rem" }));
                }
                if (this.OnContentRendered)
                    this.OnContentRendered();
                showUserInfo = false;
            }
        }
        init() {
            super.init();
        }
        render() {
            return (this.$render("i-vstack", { id: "pnlThread", width: "100%", padding: { bottom: "1rem" } },
                this.$render("i-vstack", { id: "pnlContent", gap: "0.5rem", width: "90%", mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                width: "95%"
                            }
                        }
                    ] })));
        }
    };
    ScomChatThread = __decorate([
        (0, components_8.customElements)('i-scom-chat--thread')
    ], ScomChatThread);
    exports.ScomChatThread = ScomChatThread;
    let ScomChatThreadMessage = class ScomChatThreadMessage extends components_8.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        setData(sender, pubKey, message, isMyThread, showUserInfo) {
            this.pnlMessage.border = { radius: isMyThread ? "16px 16px 2px 16px" : "16px 16px 16px 2px" };
            this.pnlMessage.background = { color: isMyThread ? "#B14FFF" : Theme.colors.secondary.main };
            if (showUserInfo) {
                const content = this.model.metadataByPubKeyMap[pubKey].content;
                this.pnlThreadMessage.prepend(this.renderAvatar(sender, content.picture));
                this.pnlMessage.appendChild(this.$render("i-label", { caption: content.display_name || content.name || "", font: { color: Theme.colors.info.main, weight: 600 }, margin: { bottom: '0.25rem' } }));
            }
            this.renderMessageContent(message, this.pnlMessage);
        }
        renderAvatar(sender, picture) {
            const url = picture || assets_1.default.fullPath('img/default_avatar.png');
            return (this.$render("i-panel", { width: "1.75rem", height: "1.75rem", position: "absolute", top: 0, left: "-2.25rem", overflow: "hidden" },
                this.$render("i-panel", { width: "100%", height: 0, overflow: "hidden", padding: { bottom: "100%" }, border: { radius: "50%" } },
                    this.$render("i-image", { class: index_css_2.imageStyle, position: "absolute", display: "block", width: "100%", height: "100%", top: "100%", left: 0, url: url, fallbackUrl: assets_1.default.fullPath('img/default_avatar.png'), cursor: "pointer", objectFit: "cover", onClick: () => this.viewUserProfile(sender) }))));
        }
        appendLabel(parent, text) {
            const splitted = text.split('\n');
            for (let i = 0; i < splitted.length; i++) {
                const elements = (0, utils_4.createLabelElements)(splitted[i], { overflowWrap: "anywhere", class: index_css_2.customLinkStyle });
                const panel = new components_8.Panel(undefined, { display: 'inline', minHeight: '1.5rem' });
                panel.append(...elements);
                parent.appendChild(panel);
            }
        }
        renderMessageContent(message, parent) {
            if (message.contentElements?.length) {
                for (let item of message.contentElements) {
                    if (item.category !== 'quotedPost') {
                        if (item.module) {
                            const pnlModule = new components_8.Panel();
                            parent.appendChild(pnlModule);
                            (0, utils_4.getEmbedElement)(item, pnlModule, async (elm) => {
                                pnlModule.minHeight = 'auto';
                                if (item.module === '@scom/scom-invoice') {
                                    const builderTarget = elm.getConfigurators().find((conf) => conf.target === 'Builders');
                                    const data = builderTarget.getData();
                                    if (data.paymentAddress) {
                                        let info = await this.model.fetchPaymentReceiptInfo(data?.paymentAddress);
                                        if (info.status === 'completed')
                                            elm.isPaid = true;
                                        if (info.tx)
                                            elm.tx = info.tx;
                                    }
                                }
                                else if (item.module === '@scom/scom-master-bot-command-widget') {
                                    console.log('conversation render scom master bot command widget', item);
                                    parent.overflow = 'unset';
                                    const scomMasterBotCommandWidget = elm;
                                    scomMasterBotCommandWidget.onExecute = async (command) => {
                                        const event = await this.model.sendTempMessage(this.model.interlocutor.id, command, null, '@scom/scom-master-bot-command-widget');
                                        const eventId = event.event.id;
                                        this.model.widgetMap.set(eventId, scomMasterBotCommandWidget);
                                    };
                                }
                                else if (item.module === 'checkout-message') {
                                    elm.setData(item.data.properties, message.createdAt);
                                }
                                if (this.OnContentRendered)
                                    this.OnContentRendered();
                            });
                            if (item.module !== '@scom/scom-markdown-editor') {
                                this.pnlThreadMessage.stack = { grow: "1", shrink: "1", basis: "0" };
                            }
                        }
                        else {
                            let content = item?.data?.properties?.content || '';
                            this.appendLabel(this.pnlMessage, content);
                            if (this.OnContentRendered)
                                this.OnContentRendered();
                        }
                    }
                }
            }
        }
        viewUserProfile(pubKey) {
            if (pubKey) {
                window.open(`#!/p/${pubKey}`, '_self');
            }
        }
        init() {
            super.init();
        }
        render() {
            return (this.$render("i-hstack", { width: "100%", gap: "0.25rem", stack: { grow: "1", shrink: "1", basis: "0" } },
                this.$render("i-hstack", { id: "pnlThreadMessage", position: "relative", maxWidth: "100%", stack: { shrink: "1" } },
                    this.$render("i-vstack", { id: "pnlMessage", class: index_css_2.messageStyle, maxWidth: "100%", padding: { top: "0.75rem", bottom: "0.75rem", left: "0.75rem", right: "0.75rem" }, lineHeight: "1.3125rem", overflow: "hidden", stack: { grow: "1", shrink: "1", basis: "0" }, gap: "0.5rem" }))));
        }
    };
    ScomChatThreadMessage = __decorate([
        (0, components_8.customElements)('i-scom-chat--thread-message')
    ], ScomChatThreadMessage);
    exports.ScomChatThreadMessage = ScomChatThreadMessage;
});
define("@scom/scom-chat/components/index.ts", ["require", "exports", "@scom/scom-chat/components/loadingSpinner.tsx", "@scom/scom-chat/components/mediaPreview.tsx", "@scom/scom-chat/components/messageComposer.tsx", "@scom/scom-chat/components/thread.tsx"], function (require, exports, loadingSpinner_1, mediaPreview_2, messageComposer_1, thread_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChatThread = exports.ScomChatMessageComposer = exports.ScomChatMediaPreview = exports.LoadingSpinner = void 0;
    Object.defineProperty(exports, "LoadingSpinner", { enumerable: true, get: function () { return loadingSpinner_1.LoadingSpinner; } });
    Object.defineProperty(exports, "ScomChatMediaPreview", { enumerable: true, get: function () { return mediaPreview_2.ScomChatMediaPreview; } });
    Object.defineProperty(exports, "ScomChatMessageComposer", { enumerable: true, get: function () { return messageComposer_1.ScomChatMessageComposer; } });
    Object.defineProperty(exports, "ScomChatThread", { enumerable: true, get: function () { return thread_1.ScomChatThread; } });
});
define("@scom/scom-chat", ["require", "exports", "@ijstech/components", "@scom/scom-chat/index.css.ts", "@scom/scom-chat/components/index.ts", "@scom/scom-chat/model.ts", "@scom/scom-chat/utils.ts"], function (require, exports, components_9, index_css_3, components_10, model_1, utils_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChat = void 0;
    const Theme = components_9.Styles.Theme.ThemeVars;
    let ScomChat = class ScomChat extends components_9.Module {
        get oldMessage() {
            return this._oldMessage;
        }
        set oldMessage(msg) {
            this._oldMessage = msg;
        }
        get isGroup() {
            return this.model.isGroup;
        }
        set isGroup(value) {
            this.model.isGroup = value;
        }
        constructMessage(content, metadataByPubKeyMap) {
            return (0, utils_5.constructMessage)(content, metadataByPubKeyMap);
        }
        clear() {
            this.oldMessage = null;
            this.pnlMessage.clearInnerHTML();
        }
        getData() {
            return this.model.getData();
        }
        setData(value) {
            this.model.setData(value);
            if (!value || !value.messages.length) {
                this.pnlMessage.clearInnerHTML();
            }
            else {
                let groupedMessage = (0, utils_5.groupMessage)(value.messages);
                this.renderThread(groupedMessage);
            }
        }
        getTag() {
            return this.tag;
        }
        setTag(value) {
            this.tag = value;
        }
        scrollToBottom() {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }
        addMessages(messages, isPrepend) {
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            let groupedMessage = (0, utils_5.groupMessage)(messages);
            for (let info of groupedMessage) {
                this.addThread(npub, info, isPrepend);
            }
        }
        renderThread(groupedMessage) {
            this.pnlMessage.clearInnerHTML();
            if (!groupedMessage)
                return;
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            for (let info of groupedMessage) {
                this.addThread(npub, info);
            }
        }
        async addThread(pubKey, info, isPrepend) {
            const thread = new components_10.ScomChatThread();
            thread.model = this.model;
            thread.OnContentRendered = () => {
                if (!isPrepend)
                    this.scrollToBottom();
            };
            await thread.ready();
            thread.addMessages(pubKey, info);
            if (isPrepend)
                this.pnlMessage.prepend(thread);
            else {
                this.pnlMessage.appendChild(thread);
                this.scrollToBottom();
            }
        }
        handleIntersect(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.oldMessage?.createdAt > 0) {
                    this.fetchOldMessages(this.oldMessage.createdAt);
                }
            });
        }
        showLoadingSpinner() {
            if (!this.loadingSpinner) {
                this.loadingSpinner = new components_10.LoadingSpinner();
                this.pnlMessageTop.append(this.loadingSpinner);
                this.loadingSpinner.setProperties({
                    minHeight: 40
                });
                this.loadingSpinner.height = 40;
            }
            this.loadingSpinner.display = 'block';
        }
        async fetchOldMessages(until) {
            if (this.isFetchingMessage)
                return;
            this.isFetchingMessage = true;
            this.showLoadingSpinner();
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            let messages = [];
            if (this.onFetchMessage)
                messages = await this.onFetchMessage(0, until);
            const filteredMessages = messages.filter(msg => msg.id !== this.oldMessage?.id);
            if (filteredMessages.length) {
                this.oldMessage = filteredMessages[filteredMessages.length - 1];
                let groupedMessage = (0, utils_5.groupMessage)(filteredMessages);
                let firstMessage = this.pnlMessage.firstElementChild;
                for (let i = groupedMessage.length - 1; i >= 0; i--) {
                    this.addThread(npub, groupedMessage[i], true);
                }
                if (firstMessage)
                    firstMessage.scrollIntoView();
            }
            this.loadingSpinner.display = 'none';
            this.isFetchingMessage = false;
        }
        async handleSendMessage(message, mediaUrls, event) {
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            const createdAt = Math.round(Date.now() / 1000);
            const newMessage = {
                messages: [],
                sender: npub
            };
            const messages = mediaUrls ? [...mediaUrls] : [];
            if (message)
                messages.push(message);
            for (let msg of messages) {
                const messageElementData = this.constructMessage(msg, this.model.metadataByPubKeyMap);
                newMessage.messages.push({
                    contentElements: [...messageElementData],
                    createdAt: createdAt
                });
                if (this.onSendMessage)
                    this.onSendMessage(msg);
            }
            this.addThread(npub, newMessage);
        }
        init() {
            this.model = new model_1.Model();
            super.init();
            const isGroup = this.getAttribute('isGroup', true);
            if (isGroup != null)
                this.isGroup = isGroup;
            this.observer = new IntersectionObserver(this.handleIntersect.bind(this));
            this.observer.observe(this.pnlMessageTop);
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%" },
                this.$render("i-vstack", { id: "messageContainer", background: { color: Theme.background.main }, stack: { grow: "1", basis: "0" }, overflow: { x: 'hidden', y: 'auto' } },
                    this.$render("i-panel", { id: "pnlMessageTop" }),
                    this.$render("i-vstack", { id: "pnlMessage", class: index_css_3.messagePanelStyle, margin: { top: "auto" }, padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, stack: { grow: "1", basis: "0" } })),
                this.$render("i-vstack", { background: { color: Theme.background.main } },
                    this.$render("i-hstack", { border: { top: { width: 1, style: 'solid', color: Theme.divider } }, mediaQueries: [
                            {
                                maxWidth: '767px',
                                properties: {
                                    border: { top: { style: 'none' } }
                                }
                            }
                        ] },
                        this.$render("i-scom-chat--message-composer", { width: "100%", margin: { top: '0.375rem', bottom: '0.375rem', left: '0.5rem', right: '0.5rem' }, onSubmit: this.handleSendMessage })))));
        }
    };
    ScomChat = __decorate([
        (0, components_9.customElements)('i-scom-chat')
    ], ScomChat);
    exports.ScomChat = ScomChat;
});
