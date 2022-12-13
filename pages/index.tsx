import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Heading, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { SetStateAction, useState } from 'react'

import { Error, Song } from 'npo'

export default function Home() {
  const [isLoading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [songList, setSongList] = useState<Song[]>([])


  const changeShareUrl = (event: { target: { value: SetStateAction<string> } }) => setShareUrl(event.target.value)

  const shareUrlInvalid = (): boolean => {
    if (shareUrl === "") return true
    return false
  }

  const checkSongs = async () => {
    setLoading(true)
    const sharing_id = shareUrl.split("/").pop() // user song list ID
    const fetchedSongList = await fetch(`/api/check?share_url=${sharing_id}`).then(r => r.json())
    setSongList(fetchedSongList)
    setLoading(false)
  }

  const reset = () => {
    setSongList([])
  }

  return (
    <div>
      <Head>
        <title>Top2000 song check</title>
        <meta name="description" content="Check if your songs made it to the top2000" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Flex alignItems="center" flexDirection="column">
          <Heading my={8} as="h1">Top2000 automatic check</Heading>
          {(songList.length === 0 || isLoading) &&
            <>
              <Box mb={6} maxWidth="95%">
                This app works by pasting your sharing URL in the box below. Once you click on Check, the app will automatically verify all of your songs,
                and tell you if they made it to the top2000 or not!
              </Box>
              <Input width={750} maxWidth="95%" mb={6} value={shareUrl} onChange={changeShareUrl} isInvalid={shareUrlInvalid()} placeholder='Sharing url' />
              <Button colorScheme='blue' onClick={checkSongs} disabled={shareUrlInvalid()}>Check</Button>
            </>
          }
          {isLoading && <div>Checking your song list...</div>}
          {songList.length > 0 && <div>
            <Button colorScheme='blue' onClick={reset}>Back</Button>
            <TableContainer width={800} maxWidth="95%">
              <Table >
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Artist</Th>
                    <Th>Name</Th>
                    <Th>In Top2000</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {songList.map(song =>
                    <Tr key={song.id}>
                      {song.image ?
                        <Td p={1}><Image src={song.image} width='44' height='44' alt={song.title}></Image></Td>
                        :
                        !song.image && <Td p={1}><Image src="/default.png" width='44' height='44' alt={song.title}></Image></Td>
                      }
                      <Td>{song.artist}</Td>
                      <Td>{song.title}</Td>
                      <Td>{song.inList ? <CheckIcon color="green" /> : <CloseIcon color="red" />}</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer></div>}
        </Flex>
      </main>
    </div>
  )
}
