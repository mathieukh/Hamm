# Hamm - Open piggy bank

The Hamm project wants to handle open piggy banks.

Every user can create a piggy bank.
A piggy bank has a name, a description and a token used to fill the piggy bank.
Each piggy bank has a beneficiary address and a withdrawer address.

The beneficiary will receive _all_ the funds from the piggy bank when withdrawing it.
The withdrawer will be the only one who can withdraw the piggy bank.

The beneficiary is immutable after the creation of a piggy bank.
The withdrawer can be change by the beneficiary or the withdrawer of a piggy bank.

When a piggy bank is obsolete, the beneficiary or the withdrawer can pause a piggy bank. The deposit will be impossible at this point.
They can resume a piggy bank.

The name and the description in the piggy banks are immutable.
