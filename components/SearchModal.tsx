'use client'

import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

import { useSearchModal } from '../hooks/useSearchModal'
import { SearchModalResults } from './search/SearchModalResults'

export const SearchModal = () => {
  const {
    emptyLabel,
    handleInputKeyDown,
    inputRef,
    itemRefs,
    open,
    query,
    searchState,
    selectedIndex,
    setOpen,
    setQuery,
    setSelectedIndex,
  } = useSearchModal()

  return (
    <div id="search-modal">
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          render={<button type="button" className="trigger" aria-label="Open search" />}
        >
          <Search size={18} className="md:mr-2 text-purple-100/70" />
          <span className="trigger-label">Search for a token</span>
          <span className="kbd">Cmd K</span>
        </Dialog.Trigger>

        <Dialog.Content className="dialog" showCloseButton={false}>
          <Dialog.Title className="sr-only">Search coins</Dialog.Title>

          <div className="search-shell">
            <div className="search-head">
              <div className="cmd-input">
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search for a token by name or symbol..."
                  className="search-input"
                />
              </div>
            </div>

            <div className="results-pane">
              <SearchModalResults
                emptyLabel={emptyLabel}
                itemRefs={itemRefs}
                items={searchState.items}
                selectedIndex={selectedIndex}
                onClose={() => setOpen(false)}
                onHoverItem={setSelectedIndex}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  )
}
