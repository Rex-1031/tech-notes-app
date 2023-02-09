import { useGetNotesQuery } from './notesApiSlice'
import { PulseLoader } from "react-spinners"
import Note from './Note'
import useAuth from '../../hooks/useAuth'
import NoNotes from './NoNotes'


const NotesList = () => {
  const { username, isManager, isAdmin } = useAuth()
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery('notesList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if(isLoading) content = <PulseLoader color={"#FFF"} />

  if(isError){
    content = <p className='errmsg'>{error?.data}</p>
  }

  if(isSuccess){
    const { ids, entities } = notes
    
    let filteredIds

    if(isManager || isAdmin){
      filteredIds = [...ids]
    }else{
      filteredIds = ids.filter(noteId => entities[noteId].username === username)
    }

    const tableContent = ids?.length &&  filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />)
      
    console.log(notes.length)
    content =(
      <table className='table table--notes'>
        <thead className='table__thead'>
          <tr>
            <th scope='col' className='table__th note__status'>Username</th>
            <th scope='col' className='table__th note__created'>Created</th>
            <th scope='col' className='table__th note__updated'>Updated</th>
            <th scope='col' className='table__th note__title'>Title</th>
            <th scope='col' className='table__th note__username'>Owner</th>
            <th scope='col' className='table__th note__edit'>Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )
  }
  if(!notes){
    return <NoNotes />
  }
  return content
}

export default NotesList