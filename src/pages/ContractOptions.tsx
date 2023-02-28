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
    title: "Cash Buy",
    desc: "Buyer purchases property with 100% 'cash'",
    pathTo: RoutesData.CashBuy.path,
    disabled: false,
  },
  {
    title: "ASA",
    desc: "Create and manage a fungible token in a low-code manner",
    pathTo: RoutesData.FungibleTokenContract.path,
    disabled: false,
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
    disabled: false,
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
              <Card>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between">
                    {i.title}{" "}
                    <Image
                      width={32}
                      height={32}
                      src={AlgoHelper_Gear}
                      className="img-fluid"
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
