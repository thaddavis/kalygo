import React, { ReactNode } from "react";
import { logErrorToMyService } from "../services/errorReporter";

// React.Component<{name: string}, person>

interface P {
  children: any;
}

interface S {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<P, S> {
  state: any = { hasError: false };

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: P) {
    super(props);
  }

  static getDerivedStateFromError(error: any) {
    console.log("getDerivedStateFromError !!!");

    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return "Something went wrong.";
    }

    // return this.props.children;
    const { hasError, error, info } = this.state;
    const { children } = this.props;

    return hasError ? "asdf" : children;
  }
}
