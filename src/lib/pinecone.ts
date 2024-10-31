import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {Document, RecursiveCharacterTextSplitter} from "@pinecone-database/doc-splitter";
let pinecone : Pinecone | null = null;

export const getPineconeClient = async () => {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!
        })
    }
    return pinecone;
}

type PDFPage = {
    pageContent : string;
    metadata : {
        loc: {pageNumber: number}
    }
}

export async function loadS3IntoPinecone(filekey: string){
    // 1. obtain the pdf -> download and read from pdf
    console.log('downloading s3 into file system')
    const file_name = await downloadFromS3(filekey);
    if(!file_name){
        console.log('error downloading from s3');
        return;
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    // 2. split and segment the pdf into smaller docs

    return pages;
}

async function prepareDocument(page: PDFPage){
    let {pageContent, metadata} = page
    pageContent = pageContent.replace(/\n/g, ' ');
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await
}