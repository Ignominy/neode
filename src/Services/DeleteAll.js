// TODO : Delete Dependencies

import { getLabelStringWithCustomerIdCheck } from "../Query/GetLabelStringWithCustomerIdCheck"

export default function DeleteAll(neode, model, customerId) {
  const labels = getLabelStringWithCustomerIdCheck("node", model, customerId)

  const query = `MATCH (node${labels}) DETACH DELETE node`

  return neode.writeCypher(query)
}
