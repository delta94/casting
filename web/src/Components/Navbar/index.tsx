import * as React from 'react'

import { StyledLink } from 'Components'
import { Container } from './style'

interface Props {}

export const Navbar: React.FC<Props> = () => (
    <Container>
        <StyledLink to="/home">Home</StyledLink>
    </Container>
)
