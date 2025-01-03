use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount},
};
use mpl_token_metadata::instruction::{create_metadata_accounts_v3, create_master_edition_v3};

declare_id!("F4nTScNPuFWhQaUrgJgACa9bD8AptzbTVdpEUKZ9tji7");

#[program]
pub mod cowai_nft {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<MintNFT>,
        creator_key: Pubkey,
        uri: String,
        title: String,
    ) -> Result<()> {
        msg!("Initializing Mint NFT");
        
        // Token mint işlemi
        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, 1)?;

        // Metadata oluştur
        let accounts = vec![
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];

        let creator = vec![
            mpl_token_metadata::state::Creator {
                address: creator_key,
                verified: false,
                share: 100,
            },
        ];

        let instruction = create_metadata_accounts_v3(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.metadata.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            title,
            "COW".to_string(),
            uri,
            Some(creator),
            1,
            true,
            false,
            None,
            None,
            None,
        );

        anchor_lang::solana_program::program::invoke(
            &instruction,
            &accounts,
        )?;

        // Master Edition oluştur
        let master_edition_infos = vec![
            ctx.accounts.master_edition.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];

        let master_edition_instruction = create_master_edition_v3(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.master_edition.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.metadata.key(),
            ctx.accounts.payer.key(),
            Some(0),
        );

        anchor_lang::solana_program::program::invoke(
            &master_edition_instruction,
            &master_edition_infos,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: UncheckedAccount<'info>,
} 