import React from 'react'
import GhostHeader from '../components/Ghost/GhostHeader'
import GhostSidebar from '../components/Ghost/GhostSidebar'
import GhostMain from '../components/Ghost/GhostMain'
import GhostFooter from '../components/Ghost/GhostFooter'

function GhostPage() {
  return (
    <div>
      <GhostHeader />
      <GhostSidebar />
      <GhostMain />
      <GhostFooter />
    </div>
  )
}

export default GhostPage
