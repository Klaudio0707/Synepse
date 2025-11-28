import { Spinner, Text, VStack } from "@chakra-ui/react"


const Spynner = () => {
    return (
        <VStack colorPalette="teal">
          <Spinner  />
          {/* <Text color="colorPalette.600">Loading...</Text> */}
        </VStack>
      )
}

export default Spynner;