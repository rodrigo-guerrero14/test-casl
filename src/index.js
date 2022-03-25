import "modern-normalize";
import React, { useState } from "react";
import { render } from "react-dom";
import { defineAbility } from "@casl/ability";
import { Can } from "@casl/react";
import faker from "faker";
import "./styles.scss";

/* Just testing out CASL */

const permissions = {
  EditCompanyAddressPermission: {
    action: "edit",
    subject: "CompanyAddress"
  },
  DeleteCompanyAddressPermission: {
    action: "delete",
    subject: "CompanyAddress"
  },
  EditStoreAddressPermission: {
    action: "edit",
    subject: "StoreAddress"
  },
  DeleteStoreAddressPermission: {
    action: "delete",
    subject: "StoreAddress"
  }
};

const users = {
  admin: {
    permissions: [
      "EditCompanyAddressPermission",
      "DeleteCompanyAddressPermission",
      "EditStoreAddressPermission",
      "DeleteStoreAddressPermission"
    ]
  },
  only_store_address: {
    permissions: ["EditStoreAddressPermission", "DeleteStoreAddressPermission"]
  },
  only_edit: {
    permissions: ["EditCompanyAddressPermission", "EditStoreAddressPermission"]
  },
  read_only: {
    permissions: []
  }
};

const addresses = Array.from({ length: 10 }, () => ({
  city: faker.address.city(),
  street: faker.address.streetAddress(),
  type: Math.random() > 0.5 ? "StoreAddress" : "CompanyAddress"
}));

const App = () => {
  const title = "CASL Test: faker data";
  const subtitle = "Click the button to cycle permissions";

  const [userId, setUserId] = useState(Object.keys(users)[0]);
  const userPermissions = users[userId].permissions.map(
    (id) => permissions[id]
  );
  const actions = [
    ...userPermissions.reduce((collection, { action }) => {
      collection.add(action);
      return collection;
    }, new Set())
  ];

  const ability = defineAbility((can) => {
    userPermissions.forEach(({ action, subject }) => {
      can(action, subject);
    });
  });

  return (
    <div style={{ margin: 10 }}>
      <div className="header">
        <div className="container">
          <h1 className="header__title">{title}</h1>
          {subtitle && <h2 className="header__subtitle">{subtitle}</h2>}
          {Object.entries(users).map(([id, user]) => (
            <button
              style={{ color: userId === id && "red" }}
              onClick={() => setUserId(id)}
              key={id}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      <hr />

      {users[userId].permissions.map((permission, ipd) => (
        <div key={ipd}>{permission}</div>
      ))}

      <hr />

      <ul>
        {addresses.map(({ city, street, type }, idx) => (
          <li key={idx} className="widget">
            <div className="option">
              {city}, {street}{" "}
              {actions.map((action, isd) => (
                <Can I={action} a={type} ability={ability} key={isd}>
                  <button className="widget__btn">{action}</button>
                </Can>
              ))}
            </div>
            <small>{type}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

const rootElement = document.getElementById("root");
render(<App />, rootElement);
