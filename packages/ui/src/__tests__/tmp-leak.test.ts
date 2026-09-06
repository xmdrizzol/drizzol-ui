import { describe, it, expect, vi } from 'vitest'
vi.stubGlobal('ResizeObserver', class { observe(){} unobserve(){} disconnect(){} })
import { mount } from '@vue/test-utils'
import DDrawer from '@ui/components/drawer'

const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

describe('teleport 清理', () => {
  it('unmount 后 teleported DOM 应移除', async () => {
    const before = document.querySelectorAll('.d-drawer').length
    const w = mount(DDrawer, { props: { visible: true, title: 't' } })
    await wait(50)
    const mounted = document.querySelectorAll('.d-drawer').length
    w.unmount()
    await wait(400)
    const after = document.querySelectorAll('.d-drawer').length
    console.log('LEAK-DBG', JSON.stringify({ before, mounted, after }))
    expect(after).toBe(before)
  })
})
