import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // タグの作成
    const tags = [
        { name: 'ガンプラ' },
        { name: 'MG' },
        { name: 'HGUC' },
        { name: '1/100' },
        { name: '1/144' },
        { name: '筆塗り' },
        { name: 'ウェザリング' },
    ]

    for (const tag of tags) {
        await prisma.tag.upsert({
            where: { name: tag.name },
            update: {},
            create: tag,
        })
    }

    // 作品データの定義
    const works = [
        {
            title: 'MG 1/100 RX-77-2 ガンキャノン',
            kitName: 'MG 1/100 RX-77-2 ガンキャノン',
            maker: 'BANDAI SPIRITS',
            scale: '1/100',
            genre: 'キャラクター',
            description: '重量感のある赤色を意識して塗装しました。',
            mainImage: '/uploads/seed-guncannon.jpg',
            tags: ['ガンプラ', 'MG', '1/100', 'ウェザリング'],
        },
        {
            title: 'RX-75ガンタンク',
            kitName: 'MG 1/100 RX-75ガンタンク',
            maker: 'BANDAI SPIRITS',
            scale: '1/100',
            genre: 'キャラクター',
            description: '履帯の汚れにこだわりました。',
            mainImage: '/uploads/1770190180927-main-1CCD6666-8269-4F2D-BC35-8BCD798C51BC.jpeg', // Existing
            tags: ['ガンプラ', 'MG', '1/100'],
        },
        {
            title: 'HGUC 1/144 MSM-07S ズゴック（シャア専用）',
            kitName: 'HGUC 1/144 MSM-07S ズゴック',
            maker: 'BANDAI SPIRITS',
            scale: '1/144',
            genre: 'キャラクター',
            description: '鮮やかなピンクを再現。',
            mainImage: '/uploads/1770196901879-main-C276765D-DC16-4014-9CE8-E0F7F71582A2-1024x1024.jpeg', // Existing
            tags: ['ガンプラ', 'HGUC', '1/144'],
        },
        {
            title: 'MG MS-06F ザク Ver.2.0',
            kitName: 'MG MS-06F ザク Ver.2.0',
            maker: 'BANDAI SPIRITS',
            scale: '1/100',
            genre: 'キャラクター',
            description: '量産型の無骨さを表現。',
            mainImage: '/uploads/1770257983360-main-IMG_8621.jpg', // Existing
            tags: ['ガンプラ', 'MG', '1/100', 'ウェザリング'],
        }
    ]

    for (const workData of works) {
        const { tags: tagNames, ...data } = workData
        await prisma.work.upsert({
            where: {
                // idがないためタイトルでマッチング（実際はtitleはuniqueではないがシード用途として）
                // title, kitNameの一致を条件にするか、新規作成するか
                // 今回は全ての作品を upsert したいが Work に unique キーが id しかないため
                // 一旦 findFirst で探す
                id: (await prisma.work.findFirst({ where: { title: data.title } }))?.id || 'temp-id'
            },
            update: data,
            create: {
                ...data,
                tags: {
                    connect: tagNames.map(name => ({ name }))
                }
            }
        })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
