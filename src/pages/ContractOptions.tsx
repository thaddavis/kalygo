import React from "react";
import { Button, Card, Col, Row, Image } from "react-bootstrap";
import { RoutesData } from "../routes";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import AlgoHelper_Gear from "../assets/img/icons/AlgoHelper_Gear.svg";

interface ContractOption {
  title: string;
  desc: string;
  pathTo: string;
  disabled: boolean;
}

let AlgorandContracts: ContractOption[] = [
  {
    title: "Escrow Agreement",
    desc: "Timed escrow agreement with stablecoin payments",
    pathTo: RoutesData.CashBuy.path,
    disabled: false,
  },
  {
    title: "ASA",
    desc: "Create a fungible token",
    pathTo: RoutesData.FungibleTokenContract.path,
    disabled: false,
  },
  // {
  //   title: "Property Rights DAO",
  //   desc: "Coming soon...",
  //   pathTo: RoutesData.NewFinanceDealContract.path,
  //   disabled: false,
  // },
  {
    title: "Security Deposit",
    desc: "Peer-to-peer security deposit",
    pathTo: RoutesData.FungibleTokenContract.path,
    disabled: true,
  },
  {
    title: "💍 Promise",
    desc: "Safely blockchainify any Q&A prize game",
    pathTo: RoutesData.CashBuy.path,
    disabled: true,
  },
  {
    title: "Financed Deal",
    desc: "Coming soon...",
    pathTo: RoutesData.NewFinanceDealContract.path,
    disabled: true,
  },
];

let EthereumContracts = [
  {
    title: "ERC-721",
    desc: "NFT Collection",
    pathTo: RoutesData.NewFinanceDealContract.path,
    disabled: true,
  },
  {
    title: "DAO",
    desc: "Coming soon...",
    pathTo: RoutesData.NewFinanceDealContract.path,
    disabled: true,
  },
];

export default function ContractOptions() {
  let navigate = useNavigate();
  const settings = useAppSelector((state: RootState) => state.settings);

  let contracts: ContractOption[] = [];
  switch (settings.selectedBlockchain) {
    case "Ethereum":
      contracts = EthereumContracts;
      break;
    case "Algorand":
      contracts = AlgorandContracts;
      break;
  }

  return (
    <div className="py-4">
      <Row>
        {contracts.map((i, idx) => {
          return (
            <Col key={i.title} xs={12} sm={6} xl={4} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="d-flex justify-content-between">
                    {i.title}{" "}
                    <Image
                      width={24}
                      height={24}
                      src={AlgoHelper_Gear}
                      className="img-fluid mx-2"
                    />
                  </Card.Title>
                  <Card.Text>{i.desc}</Card.Text>
                  <Button
                    disabled={i.disabled}
                    variant="primary"
                    onClick={() => {
                      i.pathTo && navigate(i.pathTo);
                    }}
                  >
                    Create
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
