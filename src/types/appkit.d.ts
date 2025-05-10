declare namespace JSX {
  interface IntrinsicElements {
    'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      disabled?: boolean;
      balance?: 'show' | 'hide';
      size?: 'md' | 'sm';
      label?: string;
      loadingLabel?: string;
      namespace?: 'eip155' | 'solana' | 'bip122';
    };
    'appkit-account-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      disabled?: boolean;
      balance?: 'show' | 'hide';
    };
    'appkit-connect-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      size?: 'md' | 'sm';
      label?: string;
      loadingLabel?: string;
    };
    'appkit-network-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      disabled?: boolean;
    };
    'appkit-wallet-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      wallet?: string;
    };
  }
} 