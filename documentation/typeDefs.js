module.exports = `

  type AddDocumentResponse{
    message: String
    result: String
  }

  type PendingDocumentResponse{
    tenants: [Tenant]
    owners: [Owner]
    lands: [Land]
    properties: [Property]
    total: Int
    status: String
    message: String
  }


`