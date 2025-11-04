declare module 'react-katex' {
  import { Component } from 'react';

  export interface KatexProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
  }

  export class InlineMath extends Component<KatexProps> {}
  export class BlockMath extends Component<KatexProps> {}
}

