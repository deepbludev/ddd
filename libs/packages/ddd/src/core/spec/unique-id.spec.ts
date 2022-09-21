import { UniqueID, UniqueIDProps } from '../unique-id.abstract'

class MockUniqueID extends UniqueID {
  constructor(props: UniqueIDProps) {
    super(props)
  }
}

describe('UniqueID', () => {
  const id = new MockUniqueID({ value: '123', isNew: true })
  const id2 = new MockUniqueID({ value: '123', isNew: false })
  const id3 = new MockUniqueID({ value: '456', isNew: true })

  it('should be defined', () => {
    expect(UniqueID).toBeDefined()
    expect(MockUniqueID).toBeDefined()
  })
  it('should be able to create a new instance', () => {
    expect(id).toBeDefined()
    expect(id.value).toEqual('123')
    expect(id.isNew).toEqual(true)
  })

  it('should be able to compare UUIDs', () => {
    expect(id.equal(id2)).toEqual(true)
    expect(id.equal(id3)).toEqual(false)
  })

  it('should be able to clone UUIDs', () => {
    const clone = id.clone<MockUniqueID>()
    expect(clone).toBeDefined()
    expect(clone.value).toEqual('123')
    expect(clone.isNew).toEqual(true)

    const clone2: MockUniqueID = id.clone()
    expect(clone2).toBeDefined()
    expect(clone2.value).toEqual('123')
    expect(clone2.isNew).toEqual(true)
  })
})
