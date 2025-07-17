import React from "react";

const AddressResume = ({ address }) => {
  return (
    <ul className="text-gray-600">
      <li>
        {address.firstName} {address.lastName}
      </li>
      <li>{address.email}</li>
      <li>
        {address.postalCode} {address.streetName}
      </li>
      <li>{address.phone}</li>
      <li>
        {address.city} {address.country}
      </li>
    </ul>
  );
};

export default AddressResume;
