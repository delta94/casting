import {
    CreateCompanyMutationVariables,
    CreateCompanyMutation as CreateCompanyMutationType,
    CompanyQuery_company,
    MyCompaniesQuery as MyCompaniesQueryType
} from 'GraphqlTypes'
import { CreateCompanyMutation, MyCompaniesQuery } from 'GraphqlQueries'
import { GraphqlService } from 'Common/Services/graphqlService'

export interface CreateCompanyResponse {
    data: {
        createCompany: CompanyQuery_company
    }
}

export class CompanyService {
    constructor(private readonly graphqlService: GraphqlService) {}

    getMyCompanies() {
        return this.graphqlService.query<MyCompaniesQueryType>(MyCompaniesQuery)
    }

    createCompany(
        variables: CreateCompanyMutationVariables
    ): Promise<CreateCompanyResponse> {
        return this.graphqlService.mutation<
            CreateCompanyMutationType,
            CreateCompanyMutationVariables
        >(CreateCompanyMutation, variables)
    }
}
