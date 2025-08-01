import { IJSONMessageWriter } from "../writers/IJSONPropertyWriter";
import {
  createWebhookHandler,
  NTFYWebhookListener,
} from "./NTFYWebhookListener";
describe("Webhook handler", () => {
  test("handler writes a message", () => {
    const dummyMessageWriter: IJSONMessageWriter = {
      writeMessage: jest.fn(),
    };
    const webhookHandler = createWebhookHandler(dummyMessageWriter);
    const message = "message";
    const title = "title";
    const time = 1234;
    const id = "abcde1234";
    const stringifiedData = JSON.stringify({ message, title, time, id });
    const messageEvent = createDummyMessageEventWithData({
      data: stringifiedData,
    });

    webhookHandler(messageEvent);

    expect(dummyMessageWriter.writeMessage).toHaveBeenCalledWith({
      title: { message, time, id },
    });
  });

  test("handler writes no message if the message is missing", () => {
    const dummyMessageWriter: IJSONMessageWriter = {
      writeMessage: jest.fn(),
    };
    const webhookHandler = createWebhookHandler(dummyMessageWriter);

    const title = "title";
    const time = 1234;
    const id = "abcde1234";
    const stringifiedData = JSON.stringify({ title, time, id });
    const messageEvent = createDummyMessageEventWithData({
      data: stringifiedData,
    });

    webhookHandler(messageEvent);

    expect(dummyMessageWriter.writeMessage).not.toHaveBeenCalled();
  });

  test("handler writes no message if the title is missing", () => {
    const dummyMessageWriter: IJSONMessageWriter = {
      writeMessage: jest.fn(),
    };
    const webhookHandler = createWebhookHandler(dummyMessageWriter);
    const message = "message";

    const time = 1234;
    const id = "abcde1234";
    const stringifiedData = JSON.stringify({ message, time, id });
    const messageEvent = createDummyMessageEventWithData({
      data: stringifiedData,
    });

    webhookHandler(messageEvent);

    expect(dummyMessageWriter.writeMessage).not.toHaveBeenCalled();
  });
});

describe("Webhook listener", () => {
  test("listener listens", () => {
    const dummyMessageWriter: IJSONMessageWriter = {
      writeMessage: jest.fn(),
    };

    const dummyMessageSocket: WebSocket = createDummyMessageSocket({
      addEventListener: jest.fn(),
    });
    const webhookHandler = createWebhookHandler(dummyMessageWriter);
    const listener = new NTFYWebhookListener(
      dummyMessageSocket,
      webhookHandler
    );

    listener.listen();

    expect(dummyMessageSocket.addEventListener).toHaveBeenCalledWith(
      "message",
      webhookHandler
    );
  });
});

const createDummyMessageEventWithData = (
  overrides: Partial<MessageEvent<string>>
) => {
  const messageEvent: MessageEvent<string> = {
    data: "",
    lastEventId: "",
    origin: "",
    ports: [],
    source: null,
    initMessageEvent: function (
      type: string,
      bubbles?: boolean,
      cancelable?: boolean,
      data?: any,
      origin?: string,
      lastEventId?: string,
      source?: MessageEventSource | null,
      ports?: MessagePort[]
    ): void {
      throw new Error("Function not implemented.");
    },
    bubbles: false,
    cancelBubble: false,
    cancelable: false,
    composed: false,
    currentTarget: null,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    returnValue: false,
    srcElement: null,
    target: null,
    timeStamp: 0,
    type: "",
    composedPath: function (): EventTarget[] {
      throw new Error("Function not implemented.");
    },
    initEvent: function (
      type: string,
      bubbles?: boolean,
      cancelable?: boolean
    ): void {
      throw new Error("Function not implemented.");
    },
    preventDefault: function (): void {
      throw new Error("Function not implemented.");
    },
    stopImmediatePropagation: function (): void {
      throw new Error("Function not implemented.");
    },
    stopPropagation: function (): void {
      throw new Error("Function not implemented.");
    },
    NONE: 0,
    CAPTURING_PHASE: 1,
    AT_TARGET: 2,
    BUBBLING_PHASE: 3,
    ...overrides,
  };

  return messageEvent;
};

const createDummyMessageSocket = (overrides?: Partial<WebSocket>) => {
  const messageSocket: WebSocket = {
    binaryType: "arraybuffer",
    bufferedAmount: 0,
    extensions: "",
    onclose: null,
    onerror: null,
    onmessage: null,
    onopen: null,
    protocol: "",
    readyState: 0,
    url: "",
    close: function (code?: number, reason?: string): void {
      throw new Error("Function not implemented.");
    },
    send: function (
      data: string | ArrayBufferLike | Blob | ArrayBufferView
    ): void {
      throw new Error("Function not implemented.");
    },
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    addEventListener: function <K extends keyof WebSocketEventMap>(
      type: K,
      listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void {
      throw new Error("Function not implemented.");
    },
    removeEventListener: function <K extends keyof WebSocketEventMap>(
      type: K,
      listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void {
      throw new Error("Function not implemented.");
    },
    dispatchEvent: function (event: Event): boolean {
      throw new Error("Function not implemented.");
    },
    ...overrides,
  };

  return messageSocket;
};
