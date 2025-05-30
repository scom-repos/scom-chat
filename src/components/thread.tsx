import {
    ControlElement,
    customElements,
    HStack,
    Module,
    Styles,
    VStack,
    moment,
    Panel,
    Control,
    Button
} from '@ijstech/components';
import { Model } from '../model';
import { createLabelElements, getEmbedElement, getMessageTime } from '../utils';
import { IGroupedMessage, IPostData } from '../interface';
import { customLinkStyle, imageStyle, messageStyle } from '../index.css';
import assets from '../assets';
import languageJson from '../language.json';

const Theme = Styles.Theme.ThemeVars;
type onRestoreCallback = (data: any) => Promise<boolean>;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-chat--thread']: ControlElement;
        }
    }
}

@customElements('i-scom-chat--thread')
export class ScomChatThread extends Module {
    private pnlThread: VStack;
    private pnlContent: VStack;
    private _model: Model;

    onContentRendered:() => void;
    onRestore: onRestoreCallback;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
    }
    
    clear() {
        this.pnlContent.clearInnerHTML();
    }

    toggleEnable(value: boolean) {
        const messages = this.pnlContent.querySelectorAll('i-scom-chat--thread-message');
        messages.forEach(message => {
            (message as ScomChatThreadMessage).toggleEnable(value);
        })
    }

    addMessages(pubKey: string, info: IGroupedMessage, showTime?: boolean) {
        let isMyThread = pubKey === info.sender;
        this.pnlThread.padding = this.model.isGroup ? { left: '2.25rem', bottom: "1rem" } : { bottom: "1rem" };
        this.pnlThread.alignItems = isMyThread ? "end" : "start";
        this.pnlContent.alignItems = isMyThread ? "end" : "start";
        this.renderMessages(info, isMyThread, this.model.isGroup, showTime);
        if (info?.tag?.changeId) this.classList.add(`change-${info.tag.changeId}`);
    }

    private async renderMessages(info: IGroupedMessage, isMyThread: boolean, isGroup: boolean, showTime?: boolean) {
        const messages = info.messages;
        let showUserInfo = isGroup && !isMyThread;
        for (let i = 0; i < messages.length; i++) {
            const showMessageTime = messages[i + 1] ? moment.unix(messages[i + 1].createdAt).diff(moment.unix(messages[i].createdAt)) > 60000 : (showTime ?? true);
            const threadMessage = new ScomChatThreadMessage(undefined, { width: '100%' });
            threadMessage.model = this.model;
            threadMessage.onContentRendered = this.onContentRendered;
            threadMessage.onRestore = this.onRestore;
            this.pnlContent.appendChild(threadMessage);
            await threadMessage.ready();
            threadMessage.isRestoreShown = info.isRestoreShown;
            threadMessage.tag = info.tag;
            threadMessage.setData(info.sender, info.pubKey, messages[i], isMyThread, showUserInfo);
            if (showMessageTime) {
                const msgTime = getMessageTime(messages[i].createdAt);
                this.pnlContent.appendChild(<i-label caption={msgTime} font={{ size: '0.8125rem', color: Theme.text.secondary }} lineHeight="1.25rem"></i-label>);
            }
            if (this.onContentRendered) this.onContentRendered();
            showUserInfo = false;
        }
    }

    init() {
        super.init();
    }

    render() {
        return (
            <i-vstack id="pnlThread" width="100%" padding={{ bottom: "1rem" }}>
                <i-vstack
                    id="pnlContent"
                    gap="0.5rem"
                    width="90%"
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                width: "95%"
                            }
                        }
                    ]}
                >
                </i-vstack>
            </i-vstack>
        )
    }
}

@customElements('i-scom-chat--thread-message')
export class ScomChatThreadMessage extends Module {
    private pnlContainer: HStack;
    private pnlThreadMessage: HStack;
    private pnlMessage: VStack;
    private btnRestore: Button;

    private _model: Model;
    private _isRestoreShown: boolean = false;

    onContentRendered:() => void;
    onRestore: onRestoreCallback;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
    }

    get isRestoreShown() {
        return this._isRestoreShown;
    }

    set isRestoreShown(value: boolean) {
        this._isRestoreShown = value;
        if (this.btnRestore) this.btnRestore.visible = value;
    }

    setData(sender: string, pubKey: string, message: { contentElements: IPostData[]; createdAt: number; }, isMyThread: boolean, showUserInfo: boolean) {
        this.pnlContainer.justifyContent = isMyThread ? 'end' : 'start';
        this.pnlMessage.border = { radius: isMyThread ? "16px 16px 2px 16px" : "16px 16px 16px 2px" };
        this.pnlMessage.background = { color: isMyThread ? "#B14FFF" : Theme.colors.secondary.main };
        if (showUserInfo) {
            const content = this.model.metadataByPubKeyMap[pubKey].content;
            this.pnlThreadMessage.prepend(this.renderAvatar(sender, content.picture));
            this.pnlMessage.appendChild(
                <i-label caption={content.display_name || content.name || ""} font={{ color: Theme.colors.info.main, weight: 600 }} margin={{ bottom: '0.25rem' }}></i-label>
            );
        }
        this.renderMessageContent(message, this.pnlMessage);
    }

    private renderAvatar(sender: string, picture?: string) {
        const url = picture || assets.fullPath('img/default_avatar.png')
        return (
            <i-panel width="1.75rem" height="1.75rem" position="absolute" top={0} left="-2.25rem" overflow="hidden">
                <i-panel width="100%" height={0} overflow="hidden" padding={{ bottom: "100%" }} border={{ radius: "50%" }}>
                    <i-image
                        class={imageStyle}
                        position="absolute"
                        display="block"
                        width="100%"
                        height="100%"
                        top="100%"
                        left={0}
                        url={url}
                        fallbackUrl={assets.fullPath('img/default_avatar.png')}
                        cursor="pointer"
                        objectFit="cover"
                        onClick={() => this.viewUserProfile(sender)}
                    ></i-image>
                </i-panel>
            </i-panel>
        )
    }

    private appendLabel(parent: Control, text: string) {
        const splitted = text.split('\n');
        for (let i = 0; i < splitted.length; i++) {
            const elements = createLabelElements(splitted[i], { overflowWrap: "anywhere", class: customLinkStyle });
            const panel = new Panel(undefined, {display: 'inline', minHeight: '1.5rem'});
            panel.append(...elements);
            parent.appendChild(panel);
        }
    }

    private renderMessageContent(message: { contentElements: IPostData[]; createdAt: number; }, parent: Control) {
        if (message.contentElements?.length) {
            for (let item of message.contentElements) {
                if (item.category !== 'quotedPost') {
                    if (item.module) {
                        const pnlModule = new Panel();
                        parent.appendChild(pnlModule);
                        getEmbedElement(item, pnlModule, async (elm: any) => {
                            pnlModule.minHeight = 'auto';
                            if (this.model.onEmbeddedElement) this.model.onEmbeddedElement(item.module, elm);
                            if (item.module === '@scom/scom-invoice') {
                                const builderTarget = elm.getConfigurators().find((conf: any) => conf.target === 'Builders');
                                const data = builderTarget.getData();
                                if (data.paymentAddress) {
                                    let info = await this.model.fetchPaymentReceiptInfo(data?.paymentAddress);
                                    if (info.status === 'completed') elm.isPaid = true;
                                    if (info.tx) elm.tx = info.tx;
                                }
                            }
                            else if (item.module === '@scom/scom-master-bot-command-widget') {
                                console.log('conversation render scom master bot command widget', item)
                                parent.overflow = 'unset';
                                const scomMasterBotCommandWidget: any = elm;
                                scomMasterBotCommandWidget.onExecute = async (command: string) => {
                                    const event = await this.model.sendTempMessage(this.model.interlocutor.id, command, null, '@scom/scom-master-bot-command-widget');
                                    const eventId = event.event.id;
                                    this.model.widgetMap.set(eventId, scomMasterBotCommandWidget);
                                }
                            } else if (item.module === 'checkout-message') {
                                elm.setData(item.data.properties, message.createdAt);
                            }
                            if (this.onContentRendered) this.onContentRendered();
                        });
                        if (item.module !== '@scom/scom-markdown-editor' && item.module !== '@scom/page-button') {
                            this.pnlThreadMessage.stack = { grow: "1", shrink: "1", basis: "0" };
                        }
                    } else {
                        let content: string = item?.data?.properties?.content || '';
                        this.appendLabel(this.pnlMessage, content);
                        if (this.onContentRendered) this.onContentRendered();
                    }
                }
            }
        }
    }

    private viewUserProfile(pubKey: string) {
        if (pubKey) {
            window.open(`#!/p/${pubKey}`, '_self');
        }
    }

    private async handleRestore(target: Button) {
        const data = this.tag || {};
        data.type = target.tag;
        let result = false;
        if (typeof this.onRestore === 'function')
            result = await this.onRestore(data);
        
        if (result) {
            const isRestore = !data.type || data.type === 'restore';
            this.btnRestore.icon.name = isRestore ? 'redo-alt' : 'undo-alt';
            this.btnRestore.tooltip.content = isRestore ? '$redo_checkpoint' : '$restore_checkpoint';
            this.btnRestore.tag = isRestore ? 'redo' : 'restore';
        }
    }

    toggleEnable(value: boolean) {
        this.opacity = value ? 1 : 0.7;
        this.btnRestore.enabled = value;
        const buttons = this.pnlMessage.querySelectorAll('i-button');
        buttons.forEach(button => {
            (button as Button).enabled = value;
        })
    }

    init() {
        this.i18n.init({...languageJson});
        super.init();
    }

    render() {
        return (
            <i-hstack id="pnlContainer" width="100%" gap="0.25rem" stack={{ grow: "1", shrink: "1", basis: "0" }}>
                <i-hstack id="pnlThreadMessage" position="relative" maxWidth="100%" stack={{ shrink: "1" }}>
                    <i-vstack
                        id="pnlMessage"
                        class={messageStyle}
                        maxWidth="100%"
                        padding={{ top: "0.75rem", bottom: "0.75rem", left: "0.75rem", right: "0.75rem" }}
                        lineHeight="1.3125rem"
                        overflow="hidden"
                        stack={{ grow: "1", shrink: "1", basis: "0" }}
                        gap="0.5rem"
                    ></i-vstack>
                    <i-button
                        id="btnRestore"
                        border={{ radius: '0.35rem', style: 'solid', color: Theme.divider, width: '1px' }}
                        height="1.5rem" width="1.5rem"
                        font={{ size: '0.75rem' }}
                        icon={{ name: 'undo-alt', width: '0.675rem', height: '0.675rem', fill: Theme.text.primary, stack: { shrink: '0' } }}
                        tooltip={{ content: '$restore_checkpoint', placement: 'top' }}
                        background={{ color: Theme.background.default}}
                        boxShadow='none'
                        tag="restore"
                        bottom="-0.75rem" right="0px"
                        visible={false}
                        onClick={this.handleRestore}
                    ></i-button>
                </i-hstack>
            </i-hstack>
        )
    }
}