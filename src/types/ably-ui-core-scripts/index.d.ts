declare module '@ably/ui/core/scripts';

type Store = {
  getState: () => Record<string, unknown>;
  dispatch: { type: string; payload: Record<string, unknown> };
};

type selector = (store: Store) => Record<string, unknown>;

type connectState = (selector: selector, setState: Dispatch<SetStateAction<S>>) => void;
