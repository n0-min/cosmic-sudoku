'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0E1A] via-[#1A2744] to-[#0A0E1A] text-white p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full p-8 rounded-2xl bg-[#1A2744]/80 backdrop-blur-xl nebula-edge"
            style={{
              boxShadow: '0 0 60px rgba(220, 38, 38, 0.3), inset 0 0 40px rgba(220, 38, 38, 0.1)',
            }}
          >
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-8xl"
              >
                🛸
              </motion.div>

              <div>
                <h1 className="font-title text-4xl md:text-5xl font-black bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#F87171] bg-clip-text text-transparent mb-4">
                  SYSTEM MALFUNCTION
                </h1>
                <p className="font-ui text-lg text-[#8A9BB8] tracking-wider">
                  Houston, we have a problem. The cosmic grid encountered an anomaly.
                </p>
              </div>

              {this.state.error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 bg-[#0A0E1A]/60 rounded-lg border border-[#DC2626]/30"
                >
                  <p className="font-data text-sm text-[#DC2626] break-words">
                    {this.state.error.message}
                  </p>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleReset}
                className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] hover:from-[#9333EA] hover:to-[#06B6D4] text-white font-ui text-lg uppercase tracking-wider rounded-xl transition-all glow-medium"
              >
                🔄 Restart Mission
              </motion.button>

              <p className="font-ui text-sm text-[#8A9BB8] tracking-wider">
                If the problem persists, contact mission control
              </p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
