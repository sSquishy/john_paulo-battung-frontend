export declare function getBalance(address: string): Promise<string>;
export declare function getGasPrice(): Promise<string>;
export declare function getBlockNumber(): Promise<number>;
export declare function getTransactions(address: string): Promise<{
    hash: string;
    from: string;
    to: string;
    value: string;
}[]>;
//# sourceMappingURL=eth.d.ts.map