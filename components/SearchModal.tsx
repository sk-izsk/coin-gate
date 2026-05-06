'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { useNavigationPending } from '@/hooks/useNavigationPending'
import { Search } from 'lucide-react'

import { useSearchModal } from '../hooks/useSearchModal'
import { SearchModalResults } from './search/SearchModalResults'

interface SearchModalBodyProps {
  emptyLabel: string
  handleInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  itemRefs: React.RefObject<Array<HTMLAnchorElement | null>>
  query: string
  searchState: { items: import('../hooks/useSearchResults').SearchResultItem[] }
  selectedIndex: number
  setQuery: (query: string) => void
  setSelectedIndex: (index: number) => void
}

const SearchModalBody: React.FC<SearchModalBodyProps> = ({
  emptyLabel,
  handleInputKeyDown,
  inputRef,
  itemRefs,
  query,
  searchState,
  selectedIndex,
  setQuery,
  setSelectedIndex,
}) => {
  return (
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

      <div className="results-pane relative">
        <SearchModalResults
          emptyLabel={emptyLabel}
          itemRefs={itemRefs}
          items={searchState.items}
          selectedIndex={selectedIndex}
          onHoverItem={setSelectedIndex}
        />
      </div>
    </div>
  )
}

interface SearchModalPanelProps {}

const SearchModalPanel: React.FC<SearchModalPanelProps> = () => {
  const { showPending, startPending } = useNavigationPending()
  const modal = useSearchModal({
    onSelectCoin: () => startPending(),
  })

  return (
    <Dialog open={modal.open} onOpenChange={modal.setOpen}>
      <DialogTrigger
        render={<button type="button" className="trigger" aria-label="Open search" />}
      >
        <Search size={18} className="md:mr-2 text-purple-100/70" />
        <span className="trigger-label">Search for a token</span>
        <span className="kbd">Cmd K</span>
      </DialogTrigger>

      <DialogContent className="dialog" showCloseButton={false}>
        <DialogTitle className="sr-only">Search coins</DialogTitle>

        <div className="relative">
          <SearchModalBody {...modal} />
          {showPending && <LoadingOverlay label="Opening coin details..." className="rounded-xl" />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SearchModalProps {}

export const SearchModal: React.FC<SearchModalProps> = () => {
  return (
    <div id="search-modal">
      <SearchModalPanel />
    </div>
  )
}
