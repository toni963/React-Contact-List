import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import useFetch from 'react-fetch-hook'
import ContactCards from './ContactCards'
import ContactModal from './ContactModal'

const App = () => {
  const url = 'https://randomuser.me/api/'
  const { data, isLoading, error } = useFetch(url+"?results=200")
  const [selectedContact, setSelectedContact] = useState(null)
  const [contactList, setContactList] = useState()
  const [filterQuery, setFilterQuery] = useState()

  useEffect(() => {
    if (!filterQuery) {
      setContactList(data?.results?.slice(0, 100))
    } else {
      const queryString = filterQuery.toLowerCase()
      const filteredData = data?.results?.filter(contact => {
        const fullName = `${contact.name.first} ${contact.name.last}`

        // Ako je samo jedno slovo, vrati sve kontakte koji pocinju s tim slovom
        if (queryString.length === 1) {
          const firstLetter = fullName.charAt(0).toLowerCase()
          return firstLetter === queryString
        }
        else {
          return fullName.toLowerCase().includes(queryString)
        }
      })
      setContactList(filteredData)
    }
  }, [data, filterQuery])

  return (
    <div className="bg-gray-100">
      <section>
        <form>
          <input
            type={"text"}
            placeholder={"Pretraživanje kontakata..."}
            onChange={event => setFilterQuery(event.target.value)}
            className={"ml-20 mt-6 rounded-md p-2"}
          />
        </form>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-10 md:p-20 lg:p-20">
        {isLoading
          ? <h1>Učitavanje kontakata...</h1>
          : <ContactCards contactList={contactList} setSelectedContact={setSelectedContact} />
        }
        {error && <h1>Greška prilikom učitavnja kontakata...</h1>}
        {contactList?.length < 1 && <h1>Ne postoji kontakt pod ovim nazivom</h1>}
      </section>
      <AnimatePresence>
        {selectedContact &&
          <ContactModal
            contact={selectedContact}
            setSelectedContact={setSelectedContact}
          />
        }
      </AnimatePresence>
    </div>
  )
}

export default App