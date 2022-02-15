import { createTheme, ThemeProvider } from "@mui/material"
import React  from "react"

export const withTheme = (Component: React.ReactElement): JSX.Element => (
  <ThemeProvider theme={createTheme()}>
    {Component}
  </ThemeProvider>
)