import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
export interface IEvent {
  chainName: string;
  type: "Transfer" | "Unfreeze" | string;
  fromChain?: string;
  toChain?: string;
  fromChainName?: string;
  toChainName?: string;
  actionId: string;
  txFees: string;
  dollarFees?: string;
  tokenId?: string;
  status: "Pending" | "Completed";
  fromHash: string;
  toHash?: string;
  senderAddress: string;
  targetAddress?: string;
  nftUri?: string;
  contract?: string;
  collectionName?:string;
  originalChainNonce?: string;
  originalContract?: string;
  originalTokenId?:string;
  createdAt?: Date;
}

@Entity()
export class BridgeEvent {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ nullable: true })
  chainName?: string;

  @Property({ nullable: true })
  type?: string;

  @Property({ nullable: true })
  fromChain?: string;

  @Property({ nullable: true })
  toChain?: string;

  @Property({ nullable: true })
  fromChainName?: string;

  @Property({ nullable: true })
  toChainName?: string;

  @Property({ nullable: true })
  actionId?: string;

  @Property({ nullable: true })
  txFees?: string;

  @Property({ nullable: true })
  dollarFees?: string;

  @Property({ nullable: true })
  tokenId?: string;

  @Property({ nullable: true })
  status?: string;

  @Property({ nullable: true })
  fromHash?: string;

  @Property({ nullable: true })
  toHash?: string;

  @Property({ nullable: true })
  targetAddress?: string;

  @Property({ nullable: true })
  senderAddress?: string;

  @Property({ nullable: true })
  nftUri?: string;

  @Property({ nullable: true })
  contract?: string;

  @Property({ nullable: true })
  collectionName?: string;

  @Property({ nullable: true })
  originalChainNonce?: string;

  @Property({ nullable: true })
  originalContract?: string;

  @Property({ nullable: true })
  originalTokenId?: string;

  @Property()
  createdAt?: Date = new Date();

  constructor({
    actionId,
    chainName,
    fromHash,
    senderAddress,
    status,
    toChain,
    txFees,
    dollarFees,
    type,
    tokenId,
    fromChain,
    targetAddress,
    toHash,
    nftUri,
    fromChainName,
    toChainName,
    contract,
    collectionName,
    originalChainNonce,
    originalContract,
    originalTokenId,
    createdAt
  }: IEvent) {
    this.actionId = actionId;
    this.chainName = chainName;
    this.fromHash = fromHash;
    this.senderAddress = senderAddress;
    this.status = status;
    this.toChain = toChain;
    this.txFees = txFees;
    this.type = type;
    this.tokenId = tokenId;
    this.fromChain = fromChain;
    this.targetAddress = targetAddress;
    this.toHash = toHash;
    this.nftUri = nftUri;
    this.fromChainName = fromChainName;
    this.toChainName = toChainName;
    this.dollarFees = dollarFees;
    this.contract = contract;
    this.collectionName = collectionName;
    this.originalChainNonce = originalChainNonce;
    this.originalContract = originalContract;
    this.originalTokenId = originalTokenId;
    this.createdAt = createdAt;
  }
}
