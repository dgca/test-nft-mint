"use client";
import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  useComposeCast,
  useViewCast,
  useIsInMiniApp,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { NFTMintCard } from "@coinbase/onchainkit/nft";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const { isInMiniApp } = useIsInMiniApp();
  const { composeCast } = useComposeCast();
  const { viewCast } = useViewCast();

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          <NFTMintCard contractAddress="0x44dF55B47F24B73190657fE9107Ca43234bbc21E" />

          <div className="flex flex-col gap-2">
            <h1>Is in MiniApp: {isInMiniApp ? "Yes" : "No"}</h1>

            <Button
              onClick={() => {
                composeCast({
                  text: "Hello, world!",
                });
              }}
            >
              Compose Cast
            </Button>

            <Button
              onClick={() => {
                viewCast({
                  hash: "0x32aed77ca61c92d253b98983f1e0fd20a8bd5745",
                });
              }}
            >
              View Cast
            </Button>
          </div>
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button onClick={() => openUrl("https://base.org/builders/minikit")}>
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
